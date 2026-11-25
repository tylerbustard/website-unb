import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const forbiddenPaths = [
  "client/private.html",
  "client/src/PrivateApp.tsx",
  "client/src/private-main.tsx",
  "client/src/private-fonts.css",
  "client/src/features/montreal",
  "client/src/features/toronto",
  "netlify/functions/_data",
  "netlify/tools",
  "playwright.private.config.ts",
  "tests/private-mocks.ts",
  "tests/private-portal.browser.spec.ts",
  "tests/private-redesign.shots.spec.ts",
  "client/public/certificates/northeast-christian-college.webp",
];

for (const candidate of forbiddenPaths) {
  await assert.rejects(stat(candidate), { code: "ENOENT" }, `${candidate} must not exist`);
}

const skippedRoots = new Set([".git", ".netlify", "dist", "node_modules"]);
const regularFiles = [];
async function walkCandidate(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.join(directory, entry.name).replace(/^\.\//u, "");
    if (!directory.includes(path.sep) && skippedRoots.has(entry.name)) continue;
    const metadata = await lstat(relative);
    assert.equal(metadata.isSymbolicLink(), false, `${relative} must not be a symbolic link`);
    if (metadata.isDirectory()) await walkCandidate(relative);
    else if (metadata.isFile()) regularFiles.push(relative);
  }
}
await walkCandidate(".");

const forbiddenDataFile = /(?:\.har|\.jsonl|\.ndjson|\.sqlite[^/]*|\.db|\.csv|\.tsv|\.xlsx?|\.docx|\.pptx|\.od[st]|\.rtf|\.sql|\.dump|\.zip|\.tar|\.tgz|\.gz|\.bz2|\.xz|\.7z|\.rar|\.mp3|\.m4a|\.wav|\.flac|\.mp4|\.mov|\.avi|\.mkv|\.bin|\.dmg|\.pkg|\.exe|\.dylib|\.so|\.env(?:\.[^/]*)?|\.pem|\.key|\.crt|\.cer|\.p12|\.pfx|\.bak|\.backup|\.old|\.orig|\.cookies?)$/iu;
assert.deepEqual(regularFiles.filter((file) => forbiddenDataFile.test(file)), []);

const allowedSensitiveNames = new Set([
  "client/public/Tyler-Bustard-Contact.vcf",
  "client/src/components/contact-info-section.tsx",
  "client/src/components/contact-section.tsx",
  "netlify/functions/_lib/move-ledger.mjs",
]);
const sensitiveNamePattern = /(?:^|[/_.-])(?:housing|apartments?|listings?|ledger|outreach|contacts?)(?:$|[/_.-])/iu;
assert.deepEqual(
  regularFiles.filter((file) => sensitiveNamePattern.test(file) && !allowedSensitiveNames.has(file)),
  [],
);

const binaryExtension = /\.(?:avif|gif|ico|jpe?g|pdf|png|webp)$/iu;
const baselineTree = new Map(
  execFileSync("git", ["ls-tree", "-r", "-z", "origin/main"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean)
    .map((entry) => {
      const [metadata, file] = entry.split("\t");
      return [file, metadata.split(" ")[2]];
    }),
);
const allowedNewPublicPaths = new Set([
  "client/public/404.html",
  "client/public/resume-pages/Tyler-Bustard-Resume-page-1.webp",
]);
assert.deepEqual(
  regularFiles.filter((file) => file.startsWith("client/public/") && !baselineTree.has(file) && !allowedNewPublicPaths.has(file)),
  [],
);

const allowedChangedBinaryHashes = new Map([
  ["client/public/Tyler-Bustard-Resume.pdf", "767eb2779dcf9484f1f454f260ee9f05126e6114520d949ddba13159e23eaa55"],
  ["client/public/resume-pages/Tyler-Bustard-Resume-page-1.webp", "81f25c78bb03b80ddfc4d5b0f209d67734f4f8195e919e53feb55c9fb21c5f92"],
  ["client/public/og-card.jpg", "f3f6b8da2e49d73bdcde6d77a2aee9dab47a0694c488911d2204862def94067b"],
  ["client/src/assets/fonts/archivo-latin-900-normal.woff2", "e915040a27c5310623be7ae57b6e4c508e8800206dcc37abe99984510e74a66d"],
  ["attached_assets/73strings-clients/alvarez-marsal.png", "6046260ca0ddc65af6b5ff46f127d7a477695e1ac93f88e235659360935db450"],
  ["attached_assets/73strings-clients/balderton.png", "b64305b208f46a0ac13790e5494cbb236100b91723b45892f4a6750cf98196ea"],
  ["attached_assets/73strings-clients/berkshire-partners.png", "4ee1d726d89b7f2f8099ac400d45f787ce220147655286dcfc2e183bd3bf4210"],
  ["attached_assets/73strings-clients/blackstone.png", "7e79839fdc24b47da4649b77ec16a8d267e13bc69ed1b78692b43a6425cdf2cd"],
  ["attached_assets/73strings-clients/bridgepoint.png", "f67ca124ed3a50b032b10b4ead9f464488bd83919fc7ea0abbe1fc1ee2bc4861"],
  ["attached_assets/73strings-clients/bsq.png", "ac7f8b91a0d1782bde783de1f96ba32d9ab35ff73c09cd2a1751971243a3c3ff"],
  ["attached_assets/73strings-clients/cohnreznick.png", "03e7b035fe8d354fa1078d8063bdc7d816f36d80d624ef378fbc20b671d452e1"],
  ["attached_assets/73strings-clients/eurazeo.png", "6a495c38467b55e0378c1327423320d18885caf80a2636d6612791da704c1c0a"],
  ["attached_assets/73strings-clients/gbl.png", "7082ec736d4258fd7edcf769d65953aab81b06e98844166c3c5c6da52f9ee88b"],
  ["attached_assets/73strings-clients/hamilton-lane.png", "31bf8683bc6beab48a61133c14304d09d36e9b754744ea52b4953fe00cf4fe0f"],
  ["attached_assets/73strings-clients/investec.png", "f7b0ce62e34f23f35801a94fdf732bc2e0111305558f589eb0037460ad22e9a5"],
  ["attached_assets/73strings-clients/sofina.png", "67ef03884fac55ecc7f7c41877f11f0c72e604b4e2a14d3accd7a720f4ee44d3"],
  ["attached_assets/73strings-clients/waystone.png", "58a51038bb968e2d1030285f2e03509bddf08eb9017ad0e83da5a7d18d1c22a1"],
]);
const unexpectedBinaries = [];
for (const file of regularFiles) {
  const content = await readFile(file);
  if (!binaryExtension.test(file) && !content.includes(0)) continue;
  const allowedHash = allowedChangedBinaryHashes.get(file);
  if (allowedHash) {
    const actualHash = createHash("sha256").update(content).digest("hex");
    if (actualHash !== allowedHash) unexpectedBinaries.push(file);
    continue;
  }
  const baselineOid = baselineTree.get(file);
  if (!baselineOid) {
    unexpectedBinaries.push(file);
    continue;
  }
  const currentOid = execFileSync("git", ["hash-object", "--", file], { encoding: "utf8" }).trim();
  if (currentOid !== baselineOid) unexpectedBinaries.push(file);
}
assert.deepEqual(unexpectedBinaries, []);

const functionEntries = (await readdir("netlify/functions", { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".mjs"))
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(functionEntries, [
  "montreal-move-decision-clear.mjs",
  "montreal-move-decision.mjs",
  "montreal-move.mjs",
]);

const netlifyJsonFiles = [];
async function collectJsonFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectJsonFiles(relative);
    else if (entry.name.endsWith(".json")) netlifyJsonFiles.push(relative);
  }
}
await collectJsonFiles("netlify");
assert.deepEqual(netlifyJsonFiles, []);

const machineSources = await Promise.all([
  "netlify/functions/montreal-move.mjs",
  "netlify/functions/montreal-move-decision.mjs",
  "netlify/functions/montreal-move-decision-clear.mjs",
  "netlify/functions/_lib/machine-auth.mjs",
  "netlify/functions/_lib/storage.mjs",
  "netlify/functions/_lib/move-decision-queue.mjs",
].map((file) => readFile(file, "utf8")));
const combinedMachineSource = machineSources.join("\n");
assert.doesNotMatch(
  combinedMachineSource,
  /requireSession|requireCsrf|MONTREAL_SESSION_SECRET|MONTREAL_AUTH_EMAIL|checkedInLedger|fallbackLedger|_data\//u,
);

const publicSourceFiles = [
  "client/index.html",
  "client/src/App.tsx",
  "client/src/pages/home.tsx",
  "client/src/pages/resume.tsx",
  "client/src/components/navigation.tsx",
];
const publicSource = (await Promise.all(publicSourceFiles.map((file) => readFile(file, "utf8")))).join("\n");
assert.doesNotMatch(publicSource, /\/living|\/sign-in|PrivateApp|features\/(?:montreal|toronto)/u);

const textFiles = [];
const entropyFiles = [];
for (const file of regularFiles) {
  if (binaryExtension.test(file)) continue;
  const content = await readFile(file);
  if (!content.includes(0)) {
    const text = content.toString("utf8");
    textFiles.push(text);
    if (file !== "package-lock.json") entropyFiles.push(text);
  }
}
const candidateText = textFiles.join("\n");
const entropyText = entropyFiles.join("\n");
assert.doesNotMatch(
  candidateText,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bAIza[0-9A-Za-z_-]{35}\b|\bgh[pousr]_[0-9A-Za-z]{30,}\b|\bxox[baprs]-[0-9A-Za-z-]{20,}\b|\bsk-(?:proj-)?[0-9A-Za-z_-]{20,}\b/u,
);
assert.doesNotMatch(
  candidateText,
  /MONTREAL_(?:AUTOMATION_HMAC_SECRET|SESSION_SECRET|AUTH_PASSWORD_SCRYPT)\s*=\s*["']?[^\s"']{8,}/u,
);
assert.doesNotMatch(
  candidateText,
  /(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|private[_-]?key|secret)\s*[:=]\s*["']?[A-Za-z0-9+/_=-]{12,}/iu,
);

const allowedPublicEmails = new Set(["name@example.com", "tbustard@unb.ca"]);
const emails = new Set(candidateText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu) ?? []);
assert.deepEqual([...emails].filter((email) => !allowedPublicEmails.has(email.toLowerCase())), []);

const publicPhone = "6139851223";
const phoneCandidates = candidateText.match(/(?:\+1[- .]?\d{3}[- .]?\d{3}[- .]?\d{4}|\(\d{3}\)[- .]?\d{3}[- .]?\d{4}|\b[2-9]\d{2}[2-9]\d{6}\b)/gu) ?? [];
assert.deepEqual(
  phoneCandidates.filter((phone) => {
    const digits = phone.replace(/\D/gu, "");
    return (digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits) !== publicPhone;
  }),
  [],
);

const allowedPublicAddresses = new Set([
  "1001 Sherbrooke St",
  "3420 McTavish St",
]);
const addressCandidates = candidateText.match(/\b\d{1,6}\s+[A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,4}\s+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Rue|Drive|Dr|Lane|Ln|Court|Ct|Way)\b/gu) ?? [];
assert.deepEqual(
  addressCandidates.filter((address) => !allowedPublicAddresses.has(address) && !/\bSynthetic\b/u.test(address)),
  [],
);
const frenchAddressCandidates = candidateText.match(/(?:\b(?:Unit|Apt|Apartment|Appartement)\s+[A-Za-z0-9-]+,\s*)?\b\d{1,6}\s+(?:Rue|Avenue|Boulevard|Chemin)\s+(?:(?:(?:de\s+la|de|du|des)\s+)|(?:(?:de\s+l|d|l)['’]))?[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+){0,5}\b/giu) ?? [];
assert.deepEqual(frenchAddressCandidates, []);
const allowedPublicPostalCodes = new Set(["H3A 1G5", "H3A 3L1"]);
const postalCodes = new Set(candidateText.match(/\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTVWXYZ][ -]?\d[ABCEGHJ-NPRSTVWXYZ]\d\b/giu) ?? []);
assert.deepEqual([...postalCodes].filter((value) => !allowedPublicPostalCodes.has(value.toUpperCase())), []);

function shannonEntropy(value) {
  const counts = new Map();
  for (const character of value) counts.set(character, (counts.get(character) ?? 0) + 1);
  return [...counts.values()].reduce((total, count) => {
    const probability = count / value.length;
    return total - probability * Math.log2(probability);
  }, 0);
}

const highEntropyTokens = entropyText.match(/[A-Za-z0-9_-]{40,128}/gu) ?? [];
const suspiciousTokens = highEntropyTokens.filter((token) => (
  /[a-z]/u.test(token)
  && /[A-Z]/u.test(token)
  && /\d/u.test(token)
  && shannonEntropy(token) >= 4.7
));
assert.deepEqual(suspiciousTokens, []);

process.stdout.write("Privacy scan passed: candidate tree shape, changed binaries, data-file classes, PII patterns, and secret patterns are clean.\n");
