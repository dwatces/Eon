import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Every image the site ships is used somewhere, and none is shipped twice.
// assets/ holds images the code imports (Next hashes and serves them);
// public/ holds only files served by a fixed URL.

const root = new URL("..", import.meta.url).pathname;
// Written by scripts/generate-seo-files.mjs at build; not in git.
const GENERATED = new Set(["robots.txt", "sitemap.xml"]);

function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

const source = ["components", "pages", "data", "lib"]
  .flatMap((dir) => filesIn(join(root, dir)))
  .filter((file) => file.endsWith(".js"))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

const assets = filesIn(join(root, "assets")).map((f) => relative(root, f));
const publicFiles = filesIn(join(root, "public"))
  .map((f) => relative(join(root, "public"), f))
  .filter((name) => !GENERATED.has(name));

describe("shipped images", () => {
  it.each(assets)("%s is imported by the code", (file) => {
    expect(source).toContain(`"../${file}"`);
  });

  it.each(publicFiles)("public/%s is referenced by URL", (file) => {
    expect(source).toContain(`"/${file}"`);
  });

  it("keeps public/ to the favicon and the social card", () => {
    expect(publicFiles.sort()).toEqual(["favicon.ico", "og-eon.jpg"]);
  });

  it("has no two files with the same content", () => {
    const hashes = [...assets, ...publicFiles.map((f) => `public/${f}`)].map(
      (file) =>
        createHash("md5")
          .update(readFileSync(join(root, file)))
          .digest("hex"),
    );
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});
