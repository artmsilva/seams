import { describe, it, expect } from "vite-plus/test";

import { analyzeSource } from "./analyzer.js";

describe("analyzeSource", () => {
  it("detects Seams imports", () => {
    const source = `
      import { styled, css } from '@artmsilva/seams-react';

      const Button = styled('button', {
        backgroundColor: 'blue',
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.hasStitchesImport).toBe(true);
  });

  it("detects createStitches usage", () => {
    const source = `
      import { createStitches } from '@artmsilva/seams-react';

      const { styled, css } = createStitches({
        theme: {
          colors: {
            primary: '#0070f3',
          },
        },
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.hasStitchesImport).toBe(true);
    expect(result.configs).toHaveLength(1);
    expect(result.configs[0]!.exports).toContain("styled");
    expect(result.configs[0]!.exports).toContain("css");
  });

  it("detects css() usages", () => {
    const source = `
      import { css } from '@artmsilva/seams-core';

      const button = css({
        backgroundColor: 'blue',
        padding: '10px',
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.usages).toHaveLength(1);
    expect(result.usages[0]!.type).toBe("css");
    expect(result.usages[0]!.name).toBe("button");
    expect(result.usages[0]!.hasDynamicValues).toBe(false);
  });

  it("detects styled() usages", () => {
    const source = `
      import { styled } from '@artmsilva/seams-react';

      const Button = styled('button', {
        backgroundColor: 'blue',
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.usages).toHaveLength(1);
    expect(result.usages[0]!.type).toBe("styled");
    expect(result.usages[0]!.name).toBe("Button");
  });

  it("detects globalCss() usages", () => {
    const source = `
      import { globalCss } from '@artmsilva/seams-core';

      const globalStyles = globalCss({
        '*': { margin: 0 },
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.usages).toHaveLength(1);
    expect(result.usages[0]!.type).toBe("globalCss");
  });

  it("detects keyframes() usages", () => {
    const source = `
      import { keyframes } from '@artmsilva/seams-core';

      const fadeIn = keyframes({
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.usages).toHaveLength(1);
    expect(result.usages[0]!.type).toBe("keyframes");
    expect(result.usages[0]!.name).toBe("fadeIn");
  });

  it("detects dynamic values", () => {
    const source = `
      import { css } from '@artmsilva/seams-core';

      const dynamicColor = 'blue';

      const button = css({
        backgroundColor: dynamicColor,
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.usages).toHaveLength(1);
    expect(result.usages[0]!.hasDynamicValues).toBe(true);
  });

  it("extracts static styles", () => {
    const source = `
      import { css } from '@artmsilva/seams-core';

      const button = css({
        backgroundColor: 'blue',
        padding: '10px',
        variants: {
          size: {
            sm: { fontSize: '12px' },
            lg: { fontSize: '18px' },
          },
        },
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.usages[0]!.staticStyles).toBeDefined();
    expect(result.usages[0]!.staticStyles?.["backgroundColor"]).toBe("blue");
    expect(result.usages[0]!.staticStyles?.["variants"]).toBeDefined();
  });

  it("handles original @stitches packages", () => {
    const source = `
      import { styled } from '@stitches/react';

      const Button = styled('button', {
        backgroundColor: 'blue',
      });
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.hasStitchesImport).toBe(true);
    expect(result.usages).toHaveLength(1);
  });

  it("handles TypeScript files", () => {
    const source = `
      import { styled } from '@artmsilva/seams-react';
      import type { ComponentProps } from 'react';

      const Button = styled('button', {
        backgroundColor: 'blue',
      });

      type ButtonProps = ComponentProps<typeof Button>;
    `;

    const result = analyzeSource(source, "test.tsx");

    expect(result.hasStitchesImport).toBe(true);
    expect(result.usages).toHaveLength(1);
  });
});
