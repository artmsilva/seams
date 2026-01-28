---
name: debug-extraction
description: This skill should be used when the user asks to "debug extraction", "why isn't CSS being extracted", "build plugin not working", "styles missing after build", "analyze AST", or needs to troubleshoot the build-time CSS extraction pipeline.
---

# Debug Stitches RSC CSS Extraction

Troubleshoot build-time CSS extraction issues by tracing through the analysis, extraction, transformation, and generation pipeline.

## Extraction Pipeline Overview

The build plugin processes files through four stages:

```
Source Code → Analyzer → Extractor → Transformer → CSS Generator
                ↓           ↓            ↓              ↓
           AST analysis  Static CSS   Dynamic vars   Final CSS
```

## Quick Diagnostic

### Check if File is Being Processed

Add debug logging to plugin config:

**Next.js:**
```javascript
// next.config.js
const withStitchesRSC = require('@stitches-rsc/next-plugin');

module.exports = withStitchesRSC({
  // Add files you expect to be processed
  include: ['src', 'app', 'components'],
  exclude: ['node_modules'],
})({
  webpack: (config, { isServer }) => {
    console.log('Processing files with extensions:', ['.tsx', '.ts', '.jsx', '.js']);
    return config;
  },
});
```

**Vite:**
```typescript
// vite.config.ts
import stitchesRSC from '@stitches-rsc/vite-plugin';

export default defineConfig({
  plugins: [
    stitchesRSC({
      include: ['src'],
      exclude: ['node_modules'],
    }),
  ],
});
```

### Verify Stitches Import Detection

The analyzer looks for these import patterns:

```typescript
// ✅ Detected
import { styled, css } from '@stitches-rsc/react';
import { createStitches } from '@stitches-rsc/react';
import * as Stitches from '@stitches-rsc/react';

// ❌ Not detected (would need config)
import { styled } from './stitches.config';
import { css } from '../lib/stitches';
```

## Stage-by-Stage Debugging

### Stage 1: Analyzer

The analyzer parses source code and finds Stitches usage.

**Debug with:**
```typescript
import { analyzeSource } from '@stitches-rsc/plugin-common';

const source = `
import { styled } from '@stitches-rsc/react';

const Button = styled('button', {
  backgroundColor: 'blue',
});
`;

const analysis = analyzeSource(source, 'Button.tsx');

console.log('Has Stitches import:', analysis.hasStitchesImport);
console.log('Configs found:', analysis.configs.length);
console.log('Usages found:', analysis.usages.length);

for (const usage of analysis.usages) {
  console.log('Usage:', {
    type: usage.type,           // 'styled', 'css', 'globalCss', etc.
    name: usage.name,           // Variable name if assigned
    start: usage.start,         // Source position
    hasDynamicValues: usage.hasDynamicValues,
  });
}
```

**Common issues:**
- `hasStitchesImport: false` → Import path not recognized
- `usages.length === 0` → Stitches calls not detected
- `hasDynamicValues: true` → Contains non-static values

### Stage 2: Extractor

The extractor converts static usages to CSS rules.

**Debug with:**
```typescript
import { analyzeSource, extractCss } from '@stitches-rsc/plugin-common';

const analysis = analyzeSource(source, 'Button.tsx');
const extraction = extractCss(analysis, {
  config: {
    prefix: 'app',
    theme: {
      colors: { primary: '#0070f3' },
    },
  },
});

console.log('Rules extracted:', extraction.rules.length);
console.log('Class names:', [...extraction.classNames.entries()]);

for (const rule of extraction.rules) {
  console.log('Rule:', {
    layer: rule.layer,
    selector: rule.selector,
    css: rule.css,
  });
}
```

**Common issues:**
- `rules.length === 0` → All usages have dynamic values
- Missing theme tokens → Config not passed correctly
- Wrong class names → Hash collision or naming issue

### Stage 3: Transformer

The transformer converts dynamic values to CSS variables.

**Debug with:**
```typescript
import { analyzeSource, extractCss, transformSource } from '@stitches-rsc/plugin-common';

const analysis = analyzeSource(source, 'Button.tsx');
const extraction = extractCss(analysis, {});
const transformed = transformSource({
  analysis,
  extraction,
});

console.log('Transformed code:', transformed.code);
console.log('Dynamic variables:', transformed.dynamicVariables);

for (const dynVar of transformed.dynamicVariables) {
  console.log('Dynamic var:', {
    variableName: dynVar.variableName,  // e.g., '--stitches-dyn-0'
    expression: dynVar.expression,       // Original JS expression
    className: dynVar.className,
  });
}
```

**Common issues:**
- Dynamic variables not created → Expression not detected as dynamic
- Wrong expression captured → AST traversal issue

### Stage 4: CSS Generator

The generator produces final CSS with layers and scope.

**Debug with:**
```typescript
import { generateFullCss } from '@stitches-rsc/plugin-common';

const css = generateFullCss(extraction, {
  useScope: true,
  useLayers: true,
  minify: false,
  layerPrefix: 'stitches',
});

console.log('Generated CSS:\n', css);
```

**Common issues:**
- No `@layer` → `useLayers: false`
- No `@scope` → `useScope: false`
- Minified output hard to read → Set `minify: false`

## Full Pipeline Debug Script

Create `debug-extraction.ts`:

```typescript
import { readFileSync } from 'fs';
import {
  analyzeSource,
  extractCss,
  transformSource,
  generateFullCss,
} from '@stitches-rsc/plugin-common';

const filename = process.argv[2];
if (!filename) {
  console.error('Usage: npx tsx debug-extraction.ts <file>');
  process.exit(1);
}

const source = readFileSync(filename, 'utf-8');

console.log('=== STAGE 1: ANALYSIS ===');
const analysis = analyzeSource(source, filename);
console.log('Has import:', analysis.hasStitchesImport);
console.log('Usages:', analysis.usages.length);
analysis.usages.forEach((u, i) => {
  console.log(`  [${i}] ${u.type} "${u.name}" dynamic=${u.hasDynamicValues}`);
});

console.log('\n=== STAGE 2: EXTRACTION ===');
const extraction = extractCss(analysis, {});
console.log('Rules:', extraction.rules.length);
extraction.rules.forEach((r, i) => {
  console.log(`  [${i}] ${r.layer}: ${r.selector}`);
});

console.log('\n=== STAGE 3: TRANSFORMATION ===');
const transformed = transformSource({ analysis, extraction });
console.log('Dynamic vars:', transformed.dynamicVariables.length);
transformed.dynamicVariables.forEach((v, i) => {
  console.log(`  [${i}] ${v.variableName} = ${v.expression}`);
});

console.log('\n=== STAGE 4: CSS OUTPUT ===');
const css = generateFullCss(extraction, {
  useScope: true,
  useLayers: true,
  minify: false,
});
console.log(css);
```

Run with:
```bash
npx tsx debug-extraction.ts src/components/Button.tsx
```

## Common Problems and Solutions

### Problem: "No Stitches import detected"

**Cause:** Import path doesn't match expected patterns
**Solution:** Use standard import paths:
```typescript
import { styled } from '@stitches-rsc/react';
```

### Problem: "Usage has dynamic values, skipping extraction"

**Cause:** Non-literal values in style object
**Solution:** Make values static or let them become CSS variables:
```typescript
// Dynamic - will use CSS variable
const Box = styled('div', {
  margin: dynamicValue,  // Becomes var(--stitches-dyn-X)
});

// Static - will be extracted
const Box = styled('div', {
  margin: '16px',
});
```

### Problem: "Token not found in theme"

**Cause:** Theme config not passed to extractor
**Solution:** Ensure config is provided:
```typescript
const extraction = extractCss(analysis, {
  config: {
    theme: {
      colors: { primary: '#0070f3' },
    },
  },
});
```

### Problem: "CSS not appearing in build output"

**Causes:**
1. File not in include path
2. File in exclude path
3. Build plugin not configured

**Solution:** Check plugin config paths match your file structure.

## Additional Resources

See `references/ast-patterns.md` for AST detection patterns.
