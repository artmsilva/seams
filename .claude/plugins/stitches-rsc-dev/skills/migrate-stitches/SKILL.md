---
name: migrate-stitches
description: This skill should be used when the user asks to "migrate from Stitches", "convert Stitches to RSC", "upgrade to Seams", "replace @stitches/react", or mentions migrating existing Stitches.js code to Seams.
---

# Migrate from Stitches.js to Seams

Guide migration from the original `@stitches/react` or `@stitches/core` packages to `@artmsilva/seams-react` or `@artmsilva/seams-core`.

## Migration Overview

Seams is a 1:1 API-compatible replacement. Most code works without changes. The key differences are:

1. **Package names**: `@stitches/react` → `@artmsilva/seams-react`
2. **Build plugin required**: Add Next.js or Vite plugin for CSS extraction
3. **No runtime CSS**: CSS is extracted at build time, not generated at runtime

## Migration Steps

### Step 1: Analyze Current Usage

Search the codebase for Stitches imports and usage patterns:

```bash
# Find all Stitches imports
grep -r "from '@stitches" --include="*.ts" --include="*.tsx"
grep -r "from \"@stitches" --include="*.ts" --include="*.tsx"

# Find stitches.config files
find . -name "stitches.config.*" -type f
```

### Step 2: Update Package Dependencies

Replace Stitches packages in `package.json`:

**Before:**

```json
{
  "dependencies": {
    "@stitches/react": "^1.2.8"
  }
}
```

**After:**

```json
{
  "dependencies": {
    "@artmsilva/seams-react": "^0.1.0"
  }
}
```

For core-only usage:

```json
{
  "dependencies": {
    "@artmsilva/seams-core": "^0.1.0"
  }
}
```

### Step 3: Update Imports

Replace import paths throughout the codebase:

```typescript
// Before
import { styled, css, globalCss, keyframes, createTheme } from "@stitches/react";
import { createStitches } from "@stitches/react";

// After
import { styled, css, globalCss, keyframes, createTheme } from "@artmsilva/seams-react";
import { createStitches } from "@artmsilva/seams-react";
```

Use sed for bulk replacement:

```bash
# macOS
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s/@stitches\/react/@artmsilva\/seams-react/g" {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s/@stitches\/core/@artmsilva\/seams-core/g" {} +

# Linux
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s/@stitches\/react/@artmsilva\/seams-react/g" {} +
```

### Step 4: Add Build Plugin

**For Next.js** - Install and configure:

```bash
pnpm add @artmsilva/seams-next-plugin
```

Update `next.config.js`:

```javascript
const withSeams = require("@artmsilva/seams-next-plugin");

module.exports = withSeams({
  useScope: true,
  useLayers: true,
})({
  // existing Next.js config
});
```

**For Vite** - Install and configure:

```bash
pnpm add @artmsilva/seams-vite-plugin
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import seams from "@artmsilva/seams-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    seams({
      useScope: true,
      useLayers: true,
    }),
  ],
});
```

### Step 5: Handle Breaking Patterns

#### getCssText() Usage

The `getCssText()` function still works but is primarily for SSR. With build plugins, CSS is extracted automatically.

**Before (SSR hydration):**

```tsx
// _document.tsx
<style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
```

**After:** Remove this - the build plugin handles CSS injection.

#### Dynamic css prop with Non-Serializable Values

Functions in `css` prop won't work at build time:

```tsx
// Won't work - function can't be extracted
<Box css={{ color: () => getColor() }} />

// Works - static value or variable
<Box css={{ color: dynamicColor }} />
```

The build plugin converts dynamic values to CSS variables automatically.

### Step 6: Verify Migration

1. Run the build to check for errors:

   ```bash
   pnpm build
   ```

2. Check generated CSS for proper layer structure:

   ```bash
   # Look for @layer declarations in output
   grep -r "@layer stitches" dist/
   ```

3. Test in browser - styles should apply without runtime JS

## Common Migration Issues

### Issue: Styles not applying

**Cause:** Build plugin not processing files
**Fix:** Check include/exclude patterns in plugin config

### Issue: TypeScript errors

**Cause:** Type definitions slightly different
**Fix:** Update type imports if needed - most types are compatible

### Issue: Theme tokens not resolving

**Cause:** Token syntax difference
**Fix:** Ensure `$token` syntax is used (same as original Stitches)

## Additional Resources

See `references/api-differences.md` for detailed API comparison.
See `examples/` for before/after migration examples.
