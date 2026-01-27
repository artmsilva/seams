# Contributing to Stitches RSC

Thank you for your interest in contributing!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/artmsilva/stitches-rsc.git
   cd stitches-rsc
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build all packages:
   ```bash
   pnpm build
   ```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm clean` | Remove build artifacts |

## Code Style

- TypeScript strict mode is enabled
- Use `import type` for type-only imports (`verbatimModuleSyntax`)
- Use bracket notation for index signatures (`noPropertyAccessFromIndexSignature`)
- Tests are colocated with source files (`*.test.ts`)

## Pull Request Process

1. Fork the repository and create a branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm test:run`
4. Ensure linting passes: `pnpm lint`
5. Ensure types check: `pnpm typecheck`
6. Submit a pull request

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

Open a [discussion](https://github.com/artmsilva/stitches-rsc/discussions) for questions or ideas.
