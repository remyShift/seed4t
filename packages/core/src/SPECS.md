# seed4t — Specs

> From a selection of bricks (a library + a version), produce a resolved recipe:
> the full dependency set, transitive dependencies included, deduplicated.

This is a **living test list**, not a frozen design doc. Each item is a behavior to drive out with one red test at a time. New behaviors discovered while working get added here, not implemented on the spot. The architecture is described where it **emerges**, never planned ahead.

**Delivery.** seed4t is consumed through a web initializer (`apps/web`, a Next.js app added later) that is a thin shell: it shows the catalog, takes the selection, calls the core, and returns the result. No domain logic lives in the web layer.

- **V1** output: a `package.json` text to copy-paste and install.
- **V2** output: the full hexagonal folder structure of the generated project.

Legend :
`[ ]` = todo
`[x]` = done
_italic_ = the design pressure / concept the
step surfaces.

---

## Phase 1 — Pure domain: a correct dependency graph

_What emerges: the model moves from a single `dependant` to a real resolved, deduplicated, acyclic graph. A dedicated resolution concept (a
`DependencyResolver` or a resolve method) appears out of the refactor. Still 100% in memory — no ports, no fakes. A pure domain that needs nothing external is the proof it's healthy._

- [x] **T1 — Catalog dedup.** Adding the same brick twice to the catalog keeps one
- [x] **T2 — Cart dedup.** `cart.add("a"); cart.add("a")` yields `[a]`
- [x] **T3 — Multiple dependencies.** A depends on B **and** C → adding A yields `[A, B, C]`
      _(forces the model from `dependant: Brick | null` to a real dependency list)_
- [ ] **T4 — Transitive dependencies.** A→B→C → adding A yields `[A, B, C]`
      _(the cart can no longer read direct deps; it must walk the graph via the catalog)_
- [ ] **T5 — Diamond dedup.** A→B, A→C, B→D, C→D → adding A yields `[A, B, C, D]` (D once)
      _(forces a visited-set during the traversal)_
- [ ] **T6 — Cycle.** A→B→A → no infinite loop (explicit error or stop, to be decided)
- [ ] **T7 — Dependency-aware remove.** Removing a brick respects what still depends on it
      _(product rule to decide: GC orphans, or refuse the removal)_

---

## Phase 2 — First port: version resolution

_What emerges: the first boundary of the hexagon. A default version ("latest")
lives outside the domain (the npm registry), so the domain cannot compute it. It
defines a `VersionResolver` port and is handed an in-memory fake in tests. The
real HTTP adapter is not unit-tested — it's an adapter, covered (if at all) in
integration later._

- [ ] **T8 — Default version = "latest".** `createBrick("Express")` with no version resolves the latest
      _(introduces `interface VersionResolver { latest(name): Version }`, injected; fake in tests)_
- [ ] **T9 (optional) — Range resolution.** `^5.0.0` resolves to the highest compatible version
      _(extends the same port and fake)_

---

## Phase 3 — Recipe output (V1: a package.json)

_What emerges: turning a resolved cart into output. For V1 it stays pure: a
`Recipe` value object, then a serialization to `package.json` text. No file port
yet — the web layer just returns that string and the user copies it. The real
output **port** only earns its place in V2 (writing a whole folder tree), so it
is deliberately deferred._

- [ ] **T10 — Build the recipe.** A resolved cart → a `Recipe` value object (bricks + resolved versions)
      _(pure transformation, no port)_
- [ ] **T11 — Serialize to package.json.** `Recipe` → a `package.json` JSON string
      _(pure function; the Next.js layer just hands this string back, holding no logic)_

---

## Phase 4 — Internal structure of core (no new behavior)

_The monorepo already enforces the outer boundary: `packages/core` cannot import
the Next.js app, the dependency points inward by construction. This phase is
about the **inside** of core — splitting it once a port (`VersionResolver`) and a
clear use case exist. A move-the-files refactor under green tests, not a spec._

- [ ] Split `packages/core/src` into `domain/` (pure), `ports/` (interfaces), `adapters/` (npm registry, in-memory fakes), `app/` (use case wiring resolve → recipe)
- [ ] Enforce the inner rule: `domain` never imports an adapter or `node:*`
      _(graph-level guard at build time with dependency-cruiser; optionally an
      in-editor guard with eslint-plugin-boundaries or import/no-restricted-paths.
      Wire these only once the layers physically exist, not before.)_

---

## Phase 5 — V2: scaffold a full project (the real output port)

_What emerges: when the output stops being one file and becomes a whole folder
tree (the generated project's own hexagonal structure), a genuine output **port**
finally earns its place. The domain describes the files to emit; adapters decide
where they land._

- [ ] **T12 — Describe the project tree.** `Recipe` → a pure in-memory representation of files + folders
- [ ] **T13 — Emit the tree.** introduce `interface ProjectWriter { write(tree): void }`
      _(fakes in tests; real adapters later: a zip to download, or write-to-disk)_

---

## Open decisions (settle when the test arrives, never before)

- **Dependency storage** — by name (`string[]`) rather than by `Brick` reference; the catalog is the source of truth (recommended)
- **`remove` rule** — GC orphans vs. refuse when something still depends on it (T7)
- **Cycle behavior** — explicit error vs. stop silently (T6)
- **"latest"** — real npm registry vs. a fixed table for the kata; the fake suffices for a long time
