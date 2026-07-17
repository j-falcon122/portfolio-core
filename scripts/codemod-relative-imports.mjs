#!/usr/bin/env node
/**
 * Converts `@/...` alias imports to relative imports, inside a given directory.
 * Needed because `@/*` is resolved against the CONSUMING app's tsconfig, so
 * package code can't rely on it once it's installed into another repo.
 *
 * Usage:
 *   node codemod-relative-imports.mjs <repoRoot> <targetDir1> [targetDir2 ...] [--dry]
 *
 * <repoRoot> is the repo root that "@/*" was originally relative to (e.g. the
 * portfolio-core checkout) — used to resolve what "@/x" points to.
 * <targetDir> is one or more subfolders (relative to repoRoot) whose files
 * should actually be rewritten, e.g. "lib" "components" "sanity/schemaTypes".
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2).filter((a) => a !== "--dry");
const root = path.resolve(args[0] || ".");
const targets = (args.slice(1).length ? args.slice(1) : ["."]).map((t) =>
  path.join(root, t),
);
const dry = process.argv.includes("--dry");

const IMPORT_RE =
  /(from\s+|import\(\s*|vi\.mock\(\s*|jest\.mock\(\s*)(["'])@\/([^"']+)\2/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function toRelative(fromFile, aliasPath) {
  const targetAbs = path.join(root, aliasPath);
  let rel = path.relative(path.dirname(fromFile), targetAbs);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel.split(path.sep).join("/");
}

let changedFiles = 0;
let changedImports = 0;

const allFiles = targets.flatMap((t) => walk(t));

for (const file of allFiles) {
  const original = fs.readFileSync(file, "utf8");
  let count = 0;
  const updated = original.replace(
    IMPORT_RE,
    (match, prefix, quote, aliasPath) => {
      count++;
      const relPath = toRelative(file, aliasPath);
      return `${prefix}${quote}${relPath}${quote}`;
    },
  );
  if (count > 0) {
    changedFiles++;
    changedImports += count;
    console.log(
      `${dry ? "[dry] " : ""}${path.relative(root, file)} — ${count} import(s)`,
    );
    if (!dry) fs.writeFileSync(file, updated);
  }
}

console.log(
  `\n${changedFiles} file(s), ${changedImports} import(s) ${dry ? "would be " : ""}rewritten.`,
);
