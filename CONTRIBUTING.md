# Contributing to Seams

Thank you for your interest in contributing!

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/artmsilva/seams.git
   cd seams
   ```

2. Install [Vite+](https://viteplus.dev/) (the unified toolchain):

   ```bash
   curl -fsSL https://vite.plus | bash
   ```

3. Install dependencies:

   ```bash
   vp install
   ```

4. Build all packages:
   ```bash
   vp run build
   ```

## Available Commands

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `vp run build`     | Build all packages           |
| `vp test`          | Run tests in watch mode      |
| `vp test run`      | Run tests once               |
| `vp check`         | Format, lint, and type check |
| `vp lint`          | Lint with Oxlint             |
| `vp fmt`           | Format with Oxfmt            |
| `vp run typecheck` | Run TypeScript type checking |
| `vp run clean`     | Remove build artifacts       |

## Code Style

- TypeScript strict mode is enabled
- Use `import type` for type-only imports (`verbatimModuleSyntax`)
- Use bracket notation for index signatures (`noPropertyAccessFromIndexSignature`)
- Tests are colocated with source files (`*.test.ts`)

## Pull Request Process

1. Fork the repository and create a branch from `main`
2. Make your changes
3. Ensure all checks pass: `vp check`
4. Ensure tests pass: `vp test run`
5. Submit a pull request

## Commit Messages

Use clear, descriptive commit messages. Examples:

- `fix: resolve token transformation for nested values`
- `feat: add support for responsive variants`
- `docs: update API documentation`

## Package Structure

```
packages/
├── core/           # Isomorphic API (no React)
├── react/          # React bindings
├── plugin-common/  # Shared build plugin logic
├── next-plugin/    # Next.js integration
└── vite-plugin/    # Vite integration
```

## Questions?

Open a [discussion](https://github.com/artmsilva/seams/discussions) for questions or ideas.
