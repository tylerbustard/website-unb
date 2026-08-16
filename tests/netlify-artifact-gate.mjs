import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function walkFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    const metadata = await lstat(candidate);
    assert.equal(metadata.isSymbolicLink(), false, `${candidate} must not be a symbolic link`);
    if (metadata.isDirectory()) files.push(...await walkFiles(candidate));
    else if (metadata.isFile()) files.push(candidate);
  }
  return files;
}

const functionManifest = JSON.parse(
  await readFile(".netlify/functions/manifest.json", "utf8"),
);
const expectedFunctions = [
  "montreal-move",
  "montreal-move-decision",
  "montreal-move-decision-clear",
];
const functionNames = functionManifest.functions.map(({ name }) => name).sort();
assert.deepEqual(functionNames, [...expectedFunctions].sort());

const expectedMethods = new Map([
  ["montreal-move", ["GET", "POST"]],
  ["montreal-move-decision", ["GET"]],
  ["montreal-move-decision-clear", ["POST"]],
]);
for (const bundledFunction of functionManifest.functions) {
  assert.ok(Array.isArray(bundledFunction.routes) && bundledFunction.routes.length > 0);
  const methods = [...new Set(bundledFunction.routes.flatMap((route) => route.methods ?? []))].sort();
  assert.deepEqual(methods, expectedMethods.get(bundledFunction.name));
}

const edgeManifest = JSON.parse(
  await readFile(".netlify/edge-functions-dist/manifest.json", "utf8"),
);
const expectedEdgePaths = [
  "/.well-known/tyler-private-release.json",
  "/private.html",
  "/private.html/*",
  "/sign-in",
  "/sign-in/*",
  "/living",
  "/living/*",
  "/dashboard/montreal",
  "/dashboard/montreal/*",
  "/.netlify/functions",
  "/.netlify/functions/*",
  "/api/private",
  "/api/private/*",
];
assert.deepEqual(edgeManifest.routes.map(({ path }) => path), expectedEdgePaths);
assert.deepEqual([...new Set(edgeManifest.routes.map(({ function: name }) => name))], ["living-retirement"]);

const publicFiles = await walkFiles("dist/public");
const publicRelativePaths = publicFiles.map((file) => path.relative("dist/public", file));
assert.deepEqual(
  publicRelativePaths.filter((file) => file.startsWith("assets/")).sort(),
  [
    "assets/73-strings-logo-BSAa0zGQ.webp",
    "assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330-D4NcG4eT.jpeg",
    "assets/BMO_Logo.svg_1755913265896-BY9tnbmf.png",
    "assets/CFA_Institute_Logo_1755923720192-B1DzIyYQ.png",
    "assets/Coursera_1755937682843-aRfCOzXX.png",
    "assets/Irving_Oil.svg_1755913265895-mcsid5h3.png",
    "assets/Toronto-Dominion_Bank_logo.svg_1755913265896-BTI7veQV.png",
    "assets/United-Way-Logo_1755913265895-BsWfKdy6.png",
    "assets/University_of_New_Brunswick_Logo.svg_1755912478863-BDYspeiP.png",
    "assets/anthropic_mark-CIKkanHq.png",
    "assets/canadian securities institute_1755923720191-WPbraxr-.png",
    "assets/ets_logo-BjpS22S5.webp",
    "assets/index-9631ULu_.js",
    "assets/index-qeQVBBjW.css",
    "assets/nav_avatar-CKL6bg7g.webp",
    "assets/rbc_logo-D_WP_3Xh.webp",
    "assets/resume-DmrPoytO.js",
    "assets/roi_logo_icon-CJrSG8Ll.png",
    "assets/trainning the street_1755938972014-BBKzW-4D.png",
  ].sort(),
);
for (const retiredArtifact of [
  ".well-known/tyler-private-release.json",
  "private.html",
  "living",
  "sign-in",
  "dashboard/montreal",
]) {
  assert.equal(
    publicRelativePaths.some((file) => file === retiredArtifact || file.startsWith(`${retiredArtifact}/`)),
    false,
    `${retiredArtifact} must not be published`,
  );
}
assert.deepEqual(
  publicRelativePaths.filter((file) => /^assets\/(?:private|living|montreal|toronto)-.*\.(?:css|js)$/iu.test(file)),
  [],
);
const publicApplicationText = (await Promise.all(
  publicFiles
    .filter((file) => file === "dist/public/index.html" || /^dist\/public\/assets\/.*\.(?:css|js)$/u.test(file))
    .map((file) => readFile(file, "utf8")),
)).join("\n");
assert.doesNotMatch(
  publicApplicationText,
  /\/api\/private|\/living(?:[/?#"']|$)|__Host-montreal_session|PrivateApp|tyler-private-release/u,
);

const forbiddenZipPath = /(?:^|\/)(?:_data|tools|tests?|client|playwright-report|test-results)(?:\/|$)|(?:\.har|\.jsonl|\.ndjson|\.sqlite[^/]*|\.db|\.csv|\.tsv|\.xlsx?|\.sql|\.dump|\.zip|\.tar|\.tgz|\.gz|\.pem|\.key|\.p12|\.pfx)$/iu;
for (const functionName of expectedFunctions) {
  const archive = `.netlify/functions/${functionName}.zip`;
  const entries = execFileSync("unzip", ["-Z1", archive], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  assert.deepEqual(entries.filter((entry) => forbiddenZipPath.test(entry)), []);
  const applicationEntries = entries.filter((entry) => entry.startsWith("netlify/functions/"));
  assert.deepEqual(applicationEntries, [`netlify/functions/${functionName}.mjs`]);
  const bundledApplication = execFileSync(
    "unzip",
    ["-p", archive, applicationEntries[0]],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  );
  assert.doesNotMatch(
    bundledApplication,
    /MONTREAL_(?:SESSION_SECRET|AUTH_EMAIL|AUTH_PASSWORD_SCRYPT)|requireSession|requireCsrf|checkedInLedger|fallbackLedger|(?:^|["'])_data\//u,
  );
}

const edgeBundles = (await readdir(".netlify/edge-functions-dist"))
  .filter((file) => file.endsWith(".eszip"));
assert.equal(edgeBundles.length, 1);
const edgeBundle = await readFile(path.join(".netlify/edge-functions-dist", edgeBundles[0]));
for (const marker of ["PrivateApp", "requireSession", "requireCsrf", "MONTREAL_SESSION_SECRET", "_data/"]) {
  assert.equal(edgeBundle.includes(Buffer.from(marker)), false, `edge bundle contains forbidden marker ${marker}`);
}

process.stdout.write("Netlify artifact gate passed: public output is retired and only 3 machine functions plus 1 fail-closed edge are packaged.\n");
