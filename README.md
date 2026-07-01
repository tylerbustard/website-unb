# website-unb

The `tylerbustard.ca` site — the UNB-namesake baseline.

This repo is the **original implementation baseline**; the other public variants were
cloned from it (directly or transitively):
- `website-queens-com` (`tylerbustard.com`) — cloned from this repo
- `website-mcgill-net` (`tylerbustard.net`) — cloned from `website-queens-com`
- `website-rotman-info` (`tylerbustard.info`) — cloned from `website-queens-com`
- `private-document-studio` (`finchat.ca`) — separate document-studio app, not a variant

Each repo is intentionally isolated — there is no shared package, so edits do not
propagate between sites.

Key characteristics:
- contact identity uses `tyler@tylerbustard.ca`
- canonical/public hostname is `https://tylerbustard.ca`
- education is the baseline set: UNB first, then Northeast Christian College (NCC)
  (no graduate program — UNB is this site's namesake)
- search indexing is blocked with `noindex` headers and robots rules

Routes:
- `/`
- `/resume`

Build:
```bash
npm install
npm run build
```

Netlify:
- publish directory: `dist/public`
- custom domain target: `tylerbustard.ca`
- deploys automatically from GitHub `main` via a Netlify push webhook —
  **do not run `netlify deploy` manually**

See `../AGENTS.md` (monorepo root, not committed) for the full cross-site design spec.
