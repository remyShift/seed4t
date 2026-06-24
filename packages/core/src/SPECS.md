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

- [ ] Packages should be ordered, by dependency order ==> dependency order matters for install order
e.g A depends on B, so B must be installed before A.

---

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

_What emerges: turning a resolved cart into output. For V1 it stays pure: a
`Recipe` value object, then a serialization to `package.json` text. No file port
yet — the web layer just returns that string and the user copies it. The real
output **port** only earns its place in V2 (writing a whole folder tree), so it
is deliberately deferred._

- [ ] **T10 — Build the recipe.** A resolved cart → a `Recipe` value object (bricks + resolved versions)
      _(pure transformation, no port)_
- [ ] **T11 — Serialize to package.json.** `Recipe` → a `package.json` JSON string
      _(pure function; the Next.js layer just hands this string back, holding no logic)_
