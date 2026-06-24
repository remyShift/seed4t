// Guards against a package whose declared "main" points to a file that does not
// exist after a clean build (e.g. a barrel deleted without updating package.json).
// CI builds on a fresh checkout, so a stale local build/ can hide this. We ask
// pnpm for the real workspace list and assert every declared entrypoint resolves.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const packages = JSON.parse(
  execFileSync("pnpm", ["ls", "--recursive", "--depth", "-1", "--json"], {
    encoding: "utf8",
  }),
);

let failed = false;

for (const pkg of packages) {
  const manifest = JSON.parse(
    readFileSync(join(pkg.path, "package.json"), "utf8"),
  );
  if (!manifest.main) continue;

  if (existsSync(join(pkg.path, manifest.main))) {
    console.log(`✓ ${manifest.name}: ${manifest.main}`);
  } else {
    console.error(
      `✗ ${manifest.name}: "main" → ${manifest.main} is missing after build`,
    );
    failed = true;
  }
}

if (failed) {
  console.error(
    '\nA declared "main" does not exist after build. ' +
      "Recreate the missing entrypoint (e.g. src/index.ts) or fix package.json.",
  );
  process.exit(1);
}
