# seed4t

Générateur de scaffolding TypeScript construit en TDD. L'architecture hexagonale
émerge au fil des tests (ports/adapters introduits seulement quand un test force
le domaine à sortir), elle n'est pas dessinée à l'avance.

## Stack

- TypeScript (strict)
- Vitest (tests, globals activés)
- ESLint + Prettier (qualité, Prettier gère le formatage, ESLint le reste)

## Scripts

- `npm test` : vitest en watch
- `npm run test:run` : une passe (utilisé en CI)
- `npm run coverage` : couverture (v8)
- `npm run lint` / `npm run lint:fix` : ESLint
- `npm run format` / `npm run format:check` : Prettier
- `npm run build` : compilation TS via `tsconfig.build.json` (exclut les tests)

## Node

Node 20.19.5, déclaré dans `.nvmrc` et `.tool-versions` (mise / nvm).

## Démarrage

```bash
npm install
npm test
```
