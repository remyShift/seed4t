# seed4t — Specs

> From a selection of bricks (a library + a version), produce a resolved recipe:
> the full dependency set, transitive dependencies included, deduplicated.

This is a **living test list**, not a frozen design doc. Each item is a behavior
to drive out with one red test at a time. New behaviors discovered while working
get added here, not implemented on the spot. The architecture is described where
it **emerges**, never planned ahead.

Legend :
`[ ]` = todo
`[x]` = done
_italic_ = the design pressure / concept the
step surfaces.

---

## Phase 1 — Pure domain: a correct dependency graph

_What emerges: the model moves from a single `dependant` to a real resolved,
deduplicated, acyclic graph. A dedicated resolution concept (a
`DependencyResolver` or a resolve method) appears out of the refactor. Still
100% in memory — no ports, no fakes. A pure domain that needs nothing external
is the proof it's healthy._

- [ ] **T1 — Catalog dedup.** Adding the same brick twice to the catalog keeps one
- [ ] **T2 — Cart dedup.** `cart.add("a"); cart.add("a")` yields `[a]`
- [ ] **T3 — Multiple dependencies.** A depends on B **and** C → adding A yields `[A, B, C]`
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

## Phase 3 — Second port: recipe output

_What emerges: the second edge of the hexagon. The cart is turned into a pure
`Recipe` value object, then that recipe is emitted through a `RecipeWriter`
port. Once both ports exist, the hexagon is real: pure domain at the center, one
input port and one output port, fakes in tests, real adapters at the edge._

- [ ] **T10 — Build the recipe.** A resolved cart → a `Recipe` value object (bricks + resolved versions)
      _(pure transformation, no port yet)_
- [ ] **T11 — Emit the recipe.** Writing the recipe out
      _(introduces `interface RecipeWriter { write(recipe): void }`; `InMemoryRecipeWriter` in tests)_

---

## Phase 4 — Structural refactor (no new behavior)

_Only now, with two concrete ports, does the hexagonal layout earn its place.
This is a move-the-files refactor under green tests, not a new spec._

- [ ] Split into `domain/` (pure), `ports/` (interfaces), `adapters/` (npm, fs, in-memory), `app/` (use case), `index.ts` (composition root)
- [ ] Enforce the dependency rule: `domain` never imports `adapters`/`fs`/`http`
      _(guard it at build time with dependency-cruiser so the debt can't creep back)_

---

## Open decisions (settle when the test arrives, never before)

- **Dependency storage** — by name (`string[]`) rather than by `Brick` reference; the catalog is the source of truth (recommended)
- **`remove` rule** — GC orphans vs. refuse when something still depends on it (T7)
- **Cycle behavior** — explicit error vs. stop silently (T6)
- **"latest"** — real npm registry vs. a fixed table for the kata; the fake suffices for a long time
