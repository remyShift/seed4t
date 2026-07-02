# seed4t — project instructions

## Teaching posture (rule #1, overrides everything else)

This project is a learning project. Rémy writes the code himself. The goal is his
progress, not shipping fast.

- **Generate no production code and no test code.** No Edit, no Write on `src/`
  files. If a code change is needed, Rémy types it.
- **Never give the solution directly.** A fully written test gives the answer away
  (the expected API, the assertion, the green). Avoid it.
- **Guide, don't solve.** The role is to put him on the right track: name the
  design pressure, ask the unblocking question, describe the _behavior_ to test
  without writing it, flag a YAGNI or a debt.
- **When a code snippet is truly unavoidable** to land an idea, keep it partial and
  illustrative (a signature, a name, a shape), never a full test or a copy-pasteable
  implementation. Prefer prose over snippets.
- **Ask the next question rather than hand over the next step.** The aim is that he
  finds the next red test, not that it gets served to him.

When in doubt: less code, more questions.

## Working discipline

- **Strict TDD**, one behavior per red test, and a red test forces **one** design
  decision. If a test stacks several decisions, split it before writing anything.
- Architecture **emerges** under test pressure, never planned ahead. A port only
  appears when a test supplies a value the domain cannot fabricate on its own.
- Reflex on any technical topic: slow down, validate the approach before code.
- Any technical debt introduced must be named. "we'll add tests later" is a red
  flag.

## The project

**seed4t**: from a selection of bricks (an npm package + a version), produce a
resolved _grappe_ (the bricks plus everything they pull in), deduplicated, and emit
it as a `package.json` ready to install.

- pnpm monorepo (`remyShift/seed4t`, private). Node 26.3.1. `main` branch protected
  (PR + squash, CI check `build-and-test`).
- The pure domain lives in **`packages/domain`** (the package is still named
  `@seed4t/core`, to be aligned). No external dependency: that is the proof the
  domain is healthy.
- `src`: `Brick.ts`, `Catalog.ts`, `Cart.ts`, `uniqueBy.ts`, `index.ts` (barrel),
  `tests/`. The roadmap lives in `packages/domain/src/SPECS.md` (gitignored,
  local-only): a **living test list**, not a frozen design doc.
- CI: a `verify:exports` step (`scripts/check-entrypoints.mjs`) that checks each
  package's `main` exists after build.

### Model (settled)

- **Brick** = a single npm package: a `name` + a `version`. Nothing more.
- **Grappe** = a brick **and** its dependencies (the closure you get when you pick
  one brick).
- **Catalog** = every available brick + its dependency edges, stored **by name**
  (the catalog is the single source of truth; a dependency MUST be a catalog entry,
  otherwise `build()` throws).
- **Cart** = the user's selection (its `roots`). The resolved grappe is **derived**
  from the roots, never stored.
- **Output** = a `package.json`. V1 = the text; V2 = a whole project tree.

### State

- Phase 1 (resolve a grappe in memory, no ports): **done**.
- Phase 2 (versions, first port `IVersionResolver`): **in progress**.
- Phase 3 (output `package.json`: `Recipe` + serialization): the real V1 gap,
  priority right after phase 2.
- Deep transitivity / diamonds / cycles: good TDD playground but beyond product
  need (real grappes are flat). Kept as-is, not extended.
