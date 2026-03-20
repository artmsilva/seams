# @artmsilva/seams-lit

Lit / Web Components integration for Seams. Injects Seams-generated CSS into Shadow DOM via `adoptedStyleSheets`.

## Install

```bash
npm install @artmsilva/seams-lit
```

> Requires `.npmrc` configured for the GitHub npm registry:
>
> ```
> @artmsilva:registry=https://npm.pkg.github.com
> ```

Peer dependency: `lit ^3.0.0`

## API

The package provides four exports, from most automated to most manual:

| Export            | Reactive | Description                                       |
| ----------------- | -------- | ------------------------------------------------- |
| `SeamsElement`    | Yes      | Base class -- extend instead of `LitElement`      |
| `SeamsController` | Yes      | Reactive controller -- attach to any `LitElement` |
| `seamsStyles()`   | No       | Returns a static `CSSStyleSheet` snapshot         |
| `adoptSeams()`    | No       | One-shot adopt into a `ShadowRoot`                |

### `SeamsElement` base class

Extend `SeamsElement` instead of `LitElement`. Set the static `seamsInstance` property and the class handles everything else -- CSS is kept in sync automatically as new rules are generated.

```ts
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SeamsElement } from "@artmsilva/seams-lit";
import { stitches, css } from "../seams.config";

const buttonStyles = css({
  backgroundColor: "$primary",
  padding: "$2",
  variants: {
    size: {
      sm: { padding: "$1" },
      lg: { padding: "$3" },
    },
  },
});

@customElement("my-button")
class MyButton extends SeamsElement {
  static seamsInstance = stitches;

  @property() size: "sm" | "lg" = "sm";

  render() {
    const styles = buttonStyles({ size: this.size });
    return html`<button class=${styles.className}><slot></slot></button>`;
  }
}
```

### `SeamsController`

Use this when you already have a `LitElement` subclass and cannot change the base class. The controller monitors the Seams sheet for new rules and updates the shadow root's `adoptedStyleSheets` via `replaceSync`.

```ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SeamsController } from "@artmsilva/seams-lit";
import { stitches, css } from "../seams.config";

const cardStyles = css({ padding: "$3", borderRadius: "8px" });

@customElement("my-card")
class MyCard extends LitElement {
  private seams = new SeamsController(this, stitches);

  render() {
    const styles = cardStyles();
    return html`<div class=${styles.className}><slot></slot></div>`;
  }
}
```

### `seamsStyles()`

Returns a static `CSSStyleSheet` containing all Seams CSS collected up to the point of invocation. Useful when all styles are known ahead of time and reactive updates are not needed.

```ts
import { LitElement, html } from "lit";
import { seamsStyles } from "@artmsilva/seams-lit";
import { stitches } from "../seams.config";

class MyComponent extends LitElement {
  static styles = [seamsStyles(stitches)];

  render() {
    return html`<p>Static styles only</p>`;
  }
}
```

### `adoptSeams()`

One-shot utility that creates a `CSSStyleSheet` from current Seams CSS and appends it to a shadow root. Does not set up reactive updates.

```ts
import { LitElement } from "lit";
import { adoptSeams } from "@artmsilva/seams-lit";
import { stitches } from "../seams.config";

class MyComponent extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    adoptSeams(this.shadowRoot!, stitches);
  }
}
```

## How it works

All approaches use the browser's constructable `CSSStyleSheet` API and `adoptedStyleSheets` to inject CSS directly into the shadow root -- no `<style>` tags, no FOUC.

## Docs

Full documentation: https://artmsilva.github.io/seams/
