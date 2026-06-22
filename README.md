# seed4t

TypeScript scaffolding generator built with TDD. The hexagonal architecture
emerges through the tests (ports/adapters are introduced only when a test forces
the domain to reach outward), it is not designed up front.

## Stack

- TypeScript (strict)
- Vitest (tests, globals enabled)
- ESLint + Prettier (quality; Prettier handles formatting, ESLint the rest)

## Scripts

- `npm test`: vitest in watch mode
- `npm run test:run`: single pass (used in CI)
- `npm run coverage`: coverage (v8)
- `npm run lint` / `npm run lint:fix`: ESLint
- `npm run format` / `npm run format:check`: Prettier
- `npm run build`: TS compilation via `tsconfig.build.json` (excludes tests)

## Node

Node 20.19.5, declared in `.nvmrc` and `.tool-versions` (mise / nvm).

## Getting started

```bash
npm install
npm test
```
