---
name: check-rsc-compat
description: This skill should be used when the user asks to "check RSC compatibility", "verify server component support", "is this RSC safe", "will this work in server components", "audit for client-side code", or wants to verify components work with React Server Components.
---

# Check RSC Compatibility

Verify that Stitches RSC components are compatible with React Server Components by checking for runtime CSS generation, client-side hooks, and other incompatible patterns.

## RSC Compatibility Requirements

For a component to be RSC-compatible:

1. **No runtime CSS generation** - All CSS must be extracted at build time
2. **No client-side state** - No `useState`, `useEffect`, etc. without `'use client'`
3. **No browser APIs** - No `window`, `document`, `localStorage` access
4. **Serializable props** - No functions passed as props (unless marked client)

## Quick Compatibility Check

### Check a Single File

Run this script to audit a file:

```typescript
// check-rsc.ts
import { analyzeSource } from "@stitches-rsc/plugin-common";
import { readFileSync } from "fs";

const filename = process.argv[2];
const source = readFileSync(filename, "utf-8");

const issues: string[] = [];

// Check 1: Stitches analysis
const analysis = analyzeSource(source, filename);

if (analysis.hasStitchesImport) {
  console.log("✓ Has Stitches import");

  for (const usage of analysis.usages) {
    if (usage.hasDynamicValues) {
      console.log(`⚠ Dynamic values in ${usage.type} "${usage.name}" - will use CSS variables`);
    } else {
      console.log(`✓ Static ${usage.type} "${usage.name}"`);
    }
  }
}

// Check 2: Client-only patterns
const clientPatterns = [
  { pattern: /\buseState\b/, name: "useState hook" },
  { pattern: /\buseEffect\b/, name: "useEffect hook" },
  { pattern: /\buseLayoutEffect\b/, name: "useLayoutEffect hook" },
  { pattern: /\buseRef\b/, name: "useRef hook" },
  { pattern: /\bwindow\b/, name: "window object" },
  { pattern: /\bdocument\b/, name: "document object" },
  { pattern: /\blocalStorage\b/, name: "localStorage" },
  { pattern: /\bsessionStorage\b/, name: "sessionStorage" },
  { pattern: /\baddEventListener\b/, name: "addEventListener" },
];

const hasUseClient = source.includes("'use client'") || source.includes('"use client"');

for (const { pattern, name } of clientPatterns) {
  if (pattern.test(source)) {
    if (hasUseClient) {
      console.log(`✓ ${name} (marked as client component)`);
    } else {
      issues.push(`✗ ${name} without 'use client' directive`);
    }
  }
}

// Check 3: getCssText usage
if (/getCssText\(\)/.test(source)) {
  console.log("⚠ getCssText() used - ensure this is for SSR fallback only");
}

// Summary
console.log("\n--- Summary ---");
if (issues.length === 0) {
  console.log("✓ File appears RSC-compatible");
} else {
  console.log("Issues found:");
  issues.forEach((issue) => console.log(`  ${issue}`));
}
```

Run with:

```bash
npx tsx check-rsc.ts src/components/Button.tsx
```

### Check Entire Directory

```bash
# Find files with potential RSC issues
grep -rn "useState\|useEffect\|window\.|document\." src/components/ --include="*.tsx" | grep -v "'use client'"
```

## RSC-Compatible Patterns

### ✅ Static Styled Components

```typescript
// RSC-compatible - CSS extracted at build time
const Button = styled("button", {
  backgroundColor: "$primary",
  padding: "$2 $4",
});
```

### ✅ Variants (Static)

```typescript
// RSC-compatible - all variants extracted at build time
const Button = styled("button", {
  variants: {
    size: {
      sm: { padding: "$1 $2" },
      lg: { padding: "$3 $6" },
    },
  },
});
```

### ✅ Dynamic css prop (Converted to CSS Variables)

```typescript
// RSC-compatible - dynamic value becomes CSS variable
// Server: <div className="..." style={{ '--stitches-dyn-0': value }} />
<Box css={{ marginTop: dynamicValue }} />
```

### ✅ Theme Tokens

```typescript
// RSC-compatible - tokens resolved at build time
const Card = styled("div", {
  backgroundColor: "$colors$background",
  borderRadius: "$radii$lg",
  boxShadow: "$shadows$md",
});
```

## RSC-Incompatible Patterns

### ❌ Functions in Styles

```typescript
// NOT RSC-compatible - function can't be serialized
const Box = styled("div", {
  color: () => getColor(), // Build error
});

// Fix: Use CSS variable
const Box = styled("div", {
  color: "var(--dynamic-color)",
});
```

### ❌ Runtime State Without 'use client'

```typescript
// NOT RSC-compatible without 'use client'
const Toggle = () => {
  const [active, setActive] = useState(false);
  return <Button onClick={() => setActive(!active)} />;
};

// Fix: Add 'use client' directive
'use client';

const Toggle = () => {
  const [active, setActive] = useState(false);
  return <Button onClick={() => setActive(!active)} />;
};
```

### ❌ Browser APIs Without 'use client'

```typescript
// NOT RSC-compatible
const WindowSize = () => {
  return <div>{window.innerWidth}</div>;
};

// Fix: Make it a client component
'use client';

const WindowSize = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  return <div>{width}</div>;
};
```

## Build-Time Verification

### Verify CSS Extraction

After building, check that CSS is extracted:

```bash
# Check for generated CSS file
ls -la dist/*.css .next/static/css/*.css 2>/dev/null

# Verify styles are in CSS, not JS
grep -c "backgroundColor" dist/stitches.css  # Should have matches
grep -c "backgroundColor.*:" dist/*.js       # Should be minimal
```

### Verify No Runtime CSS

Check that styled components don't include CSS generation code:

```bash
# Look for CSS generation patterns in JS output
grep -l "insertRule\|createElement.*style" dist/*.js

# If found, investigate - might indicate runtime CSS generation
```

## Component Architecture for RSC

### Recommended Pattern

Split components into server and client parts:

```
components/
├── Button/
│   ├── Button.tsx        # Server component (styled)
│   ├── Button.client.tsx # Client component (interactions)
│   └── index.ts          # Re-export
```

**Button.tsx (Server):**

```typescript
import { styled } from "@stitches-rsc/react";

export const ButtonBase = styled("button", {
  backgroundColor: "$primary",
  variants: {
    size: {
      sm: { padding: "$1 $2" },
      lg: { padding: "$3 $6" },
    },
  },
});
```

**Button.client.tsx (Client):**

```typescript
'use client';

import { ButtonBase } from './Button';

export const InteractiveButton = ({ onClick, ...props }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return <ButtonBase {...props} onClick={handleClick} disabled={loading} />;
};
```

## Troubleshooting

### "Cannot use useState in Server Component"

Add `'use client'` directive at the top of the file.

### "window is not defined"

The code is running on the server. Either:

1. Add `'use client'` directive
2. Use `typeof window !== 'undefined'` guard
3. Move to `useEffect`

### "Styles not applying in production"

Verify the build plugin is configured and CSS is being extracted:

```bash
pnpm build
cat dist/stitches.css | head -50
```

## Additional Resources

See `references/rsc-patterns.md` for more RSC architecture patterns.
