# Release, smoke check, rollback and recovery

The prototype is a static site. GitHub Actions (`.github/workflows/pages.yml`)
builds `main` with `npm ci` and `npm run build` on the Node version from
`.nvmrc` and publishes `dist/` to GitHub Pages at
<https://olitta13.github.io/doroboty-ai/>. There is no server, database or
secret. Visitor data lives only in each visitor's browser (localStorage).

The same `main` branch is also published on Netlify (quest Deploy Pilot).
`netlify.toml` sets the build command, the `dist/` directory, Node 24 and
basic security headers; no environment variables are required. Netlify builds
every push to `main` automatically, and a rollback is „Publish deploy” on an
earlier deploy in the Netlify Deploys tab.

Owner and first responder: Aleksandra Doruch (repository owner of
`olitta13/doroboty-ai`, with access to its Actions tab).

## Before publishing

1. Run `./scripts/verify` (same gate as `npm run check`) on the commit to publish.
2. Regenerate `docs/production-readiness.html` for that commit if sources changed.
3. Push the commit to `main`; the Pages workflow starts automatically.

## Smoke check right after publishing

Run within a few minutes of the green Pages workflow, in a private window:

1. Open the site; the homepage heading „Praca dla ludzi, którzy dowożą z AI.”
   and the illustration appear, with no errors in the browser console.
2. Choose „Anna Kowalska”, apply to AI Product Manager with a one-sentence own
   contribution and send; „Aplikacja została wysłana” appears.
3. Choose „Karolina Wiśniewska”, open „Kandydaci”, add the synthetic candidates;
   the short list shows five people including Anna. Refresh: the list remains.
4. Open „Zobacz zgłoszenie”; the contribution quote is the first section.
5. In the browser network panel, no request goes to a host other than
   `olitta13.github.io`.
6. Confirm `http://` redirects to `https://`.

Any failed step means the release is not accepted: roll back (below).

## Rollback

Code rollback is safe for stored data: the previous release (`81682a8`) reads
saves written by the current release and ignores the newer `contribution` field
(verified with a Vitest parse of a current save in a worktree of `81682a8`).

1. On GitHub, open the commit that caused the problem and revert it
   (`git revert <sha>` locally and push, or the GitHub UI revert of the merged
   pull request).
2. The push to `main` republishes the previous behavior automatically.
3. Alternatively, in Actions → „Publikacja prototypu (GitHub Pages)”, open the
   last successful run of the previous commit and choose „Re-run all jobs”.
4. Run the smoke check again on the rolled-back version.

## Recovery when the site is down

1. Open <https://www.githubstatus.com/> — a GitHub Pages incident cannot be
   fixed from this repository; wait and re-check.
2. Open the repository Actions tab. If the latest Pages run failed, read the
   failing step; fix forward or roll back as above.
3. If no run failed, start „Publikacja prototypu (GitHub Pages)” manually
   (Run workflow on `main`).
4. Confirm the smoke check passes and note the incident in `docs/tasks/`.
