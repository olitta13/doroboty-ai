# Production readiness: preparation stage

## Intent

Run the production-readiness audit on the version intended for publication and
fix every blocker found before deployment. Deployment itself happens in a later
quest.

## Acceptance criteria

- Two tabs of one browser no longer overwrite each other's saved scenario
  (reproduced: a candidate submission vanished when the employer persona was
  chosen in an older tab).
- A render error shows a recovery screen instead of a blank page.
- `npm run check` passes with `docs/production-readiness.html` in the tree.
- Release, smoke check, rollback and recovery are documented (`docs/release.md`).
- A fresh audit for the fixed sources reports no open preparation blockers.

## Follow-up recommendations

- Footer link to the repository bug form (owner enabled Issues on the fork).
- Marketplace illustration served as WebP to cut the offers page from 2.3 MB to about 0.9 MB.

## Verification

New e2e tests for both defects fail on the previous sources and pass after the
fix; full `npm run check`; refreshed `docs/production-readiness.html`.
