import { CodeBlock } from "../components/CodeBlock";
import { Section, SubHeading, Paragraph, InlineCode } from "../components/Section";

const controllerExample = `// my-button.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SeamsController } from "@artmsilva/seams-lit";
import { stitches, css } from "../seams.config";

const buttonStyles = css({
  backgroundColor: "$primary",
  color: "white",
  padding: "$2 $3",
  borderRadius: "$md",
  border: "none",
  cursor: "pointer",

  variants: {
    size: {
      sm: { padding: "$1 $2", fontSize: "14px" },
      lg: { padding: "$3 $4", fontSize: "18px" },
    },
  },
});

@customElement("my-button")
export class MyButton extends LitElement {
  private seams = new SeamsController(this, stitches);

  @property() size: "sm" | "lg" = "sm";

  render() {
    const styles = buttonStyles({ size: this.size });
    return html\`<button class=\${styles.className}><slot></slot></button>\`;
  }
}`;

const baseClassExample = `// my-card.ts
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SeamsElement } from "@artmsilva/seams-lit";
import { stitches, css } from "../seams.config";

const cardStyles = css({
  padding: "$4",
  borderRadius: "$lg",
  backgroundColor: "$bg",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
});

@customElement("my-card")
export class MyCard extends SeamsElement {
  static seamsInstance = stitches;

  @property() heading = "";

  render() {
    const styles = cardStyles();
    return html\`
      <div class=\${styles.className}>
        <h2>\${this.heading}</h2>
        <slot></slot>
      </div>
    \`;
  }
}`;

const seamsStylesExample = `// my-badge.ts
import { LitElement, html, css as litCss } from "lit";
import { customElement } from "lit/decorators.js";
import { seamsStyles } from "@artmsilva/seams-lit";
import { stitches, css } from "../seams.config";

const badgeStyles = css({
  display: "inline-block",
  padding: "$1 $2",
  borderRadius: "$sm",
  backgroundColor: "$secondary",
  color: "white",
  fontSize: "$xs",
});

// Call css() at module level so rules are registered
const badge = badgeStyles();

@customElement("my-badge")
export class MyBadge extends LitElement {
  // seamsStyles() creates a static snapshot of all Seams CSS
  static styles = [
    seamsStyles(stitches),
    litCss\`:host { display: inline-block; }\`,
  ];

  render() {
    return html\`<span class=\${badge.className}><slot></slot></span>\`;
  }
}`;

const adoptSeamsExample = `// my-tooltip.ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { adoptSeams } from "@artmsilva/seams-lit";
import { stitches, css } from "../seams.config";

const tooltipStyles = css({
  padding: "$1 $2",
  backgroundColor: "$text",
  color: "$bg",
  borderRadius: "$sm",
  fontSize: "$xs",
});

@customElement("my-tooltip")
export class MyTooltip extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    // One-shot adoption of current Seams CSS
    adoptSeams(this.shadowRoot!, stitches);
  }

  render() {
    const styles = tooltipStyles();
    return html\`<span class=\${styles.className}><slot></slot></span>\`;
  }
}`;

export function LitIntegration() {
  return (
    <Section id="lit-integration" title="Lit Integration">
      <Paragraph>
        The <InlineCode>@artmsilva/seams-lit</InlineCode> package brings Seams to Lit and Web
        Components. It uses the <InlineCode>adoptedStyleSheets</InlineCode> API to inject
        Seams-generated CSS directly into each component's Shadow DOM, keeping styles encapsulated
        without <InlineCode>{"<style>"}</InlineCode> tag duplication.
      </Paragraph>

      <SubHeading>SeamsController</SubHeading>
      <Paragraph>
        A Lit <InlineCode>ReactiveController</InlineCode> that keeps a shadow root's adopted
        stylesheets in sync with dynamically generated Seams CSS. It monitors the Seams sheet for
        new rules and updates the adopted <InlineCode>CSSStyleSheet</InlineCode> via{" "}
        <InlineCode>replaceSync</InlineCode>. This is the recommended approach for components that
        generate styles dynamically based on properties or state.
      </Paragraph>
      <CodeBlock label="my-button.ts">{controllerExample}</CodeBlock>

      <SubHeading>SeamsElement base class</SubHeading>
      <Paragraph>
        A convenience base class that extends <InlineCode>LitElement</InlineCode> and sets up a{" "}
        <InlineCode>SeamsController</InlineCode> automatically. Subclasses only need to set the
        static <InlineCode>seamsInstance</InlineCode> property. Use this when you want the simplest
        possible setup with no boilerplate.
      </Paragraph>
      <CodeBlock label="my-card.ts">{baseClassExample}</CodeBlock>

      <SubHeading>seamsStyles()</SubHeading>
      <Paragraph>
        Creates a static <InlineCode>CSSStyleSheet</InlineCode> snapshot from all Seams CSS
        collected at call time. Use this with Lit's static <InlineCode>styles</InlineCode> property
        when your component's styles are fully known at definition time and do not change
        dynamically. The returned sheet does not update when new rules are added.
      </Paragraph>
      <CodeBlock label="my-badge.ts">{seamsStylesExample}</CodeBlock>

      <SubHeading>adoptSeams()</SubHeading>
      <Paragraph>
        A one-shot utility that creates a <InlineCode>CSSStyleSheet</InlineCode> from current Seams
        CSS and appends it to a shadow root. Useful for non-Lit web components or cases where you
        need manual control over when styles are adopted. For automatic syncing, prefer{" "}
        <InlineCode>SeamsController</InlineCode> instead.
      </Paragraph>
      <CodeBlock label="my-tooltip.ts">{adoptSeamsExample}</CodeBlock>

      <SubHeading>Which approach to use?</SubHeading>
      <Paragraph>
        Use <InlineCode>SeamsController</InlineCode> or <InlineCode>SeamsElement</InlineCode> when
        styles depend on reactive properties, since they automatically sync new CSS rules into the
        shadow root. Use <InlineCode>seamsStyles()</InlineCode> for static components where all
        style variants are known at module evaluation time. Use{" "}
        <InlineCode>adoptSeams()</InlineCode> for vanilla web components outside Lit or for one-off
        style injection.
      </Paragraph>
    </Section>
  );
}
