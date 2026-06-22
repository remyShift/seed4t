# seed4t

A TypeScript scaffolding generator. Instead of cloning a fixed boilerplate and
deleting what you don't need, you compose a project from small, reusable
**bricks** and let the tool work out how they fit together.

## The idea

A brick is a single capability you might want in a project (a test runner, a
linter, a web framework...). Each brick knows what it depends on. You pick the
bricks you care about, drop them into a **cart**, and seed4t resolves the rest:
it pulls in every dependency, deduplicates what's shared, and produces a single
coherent recipe describing the project to generate.

The goal is to make a scaffold the sum of explicit choices rather than a
monolith you trim down. Add a brick, get exactly its dependencies, nothing more.

## Principle

The project is built test-first, as a way to let the design earn its shape. The
domain stays pure and the architecture is allowed to emerge from the tests:
boundaries to the outside world (resolving versions, writing files) are
introduced only when a test actually forces the domain to reach out, never
sketched in advance.

## Getting started

```bash
npm install
npm test
```
