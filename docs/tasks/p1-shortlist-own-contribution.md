# P1 — shortlist by own contribution

## Intent

AIPH3 Supersprint week 2 decision (prototype P1). Employers cannot tell before inviting what a candidate did personally, so they pay for postings whose first conversations end without continuation. Case signals: from June a Match Score of 90+ continued in 17.9% of first conversations (May: 58.0%); a candidate's sentence about their own role predicted continuation in every month; companies with >40% continuations repurchased in 57.2% vs 28.6% at ≤25% (association, not causation).

## Scope

1. Candidate application: required one-sentence own contribution (20–300 chars), saved in drafts and the application snapshot.
2. Employer candidates view: default „Krótka lista” tab per offer with up to 5 open applications ordered by a transparent rule; „Wszystkie zgłoszenia” keeps the full list.
3. Application records show the contribution quote first.
4. Simulation: prepared synthetic applicants (seed button) and the ordering rule. No model call.

## Acceptance

- Employer Karolina opens Moje oferty → Krótka lista kandydatów → sees five candidates with their own sentences → opens one → records a decision; the existing review → invite → conversation → continue path still works.
- Candidate cannot submit without the contribution sentence; legacy drafts/imports remain valid.

## Evidence (local, 2026-11-08, Node 22 in agent workspace)

- `prettier --check`, `eslint --max-warnings=0`, `tsc --noEmit`, `vitest run` (31 tests), `vite build`, `npm run verify:packet`: passed.
- `playwright test`: 34 passed after updating application journeys to fill the new required field.
- `npm run design-system:check`: not completed — requires Node 24, workspace had Node 22. Kit files unchanged.
- Scripted walk-through: Anna applies with a sentence; Karolina seeds the shortlist; order Julia Mazur, Natalia Pawlak, Anna Kowalska, Aleksandra Krawczyk, Kamil Wójcik; Michał Grabowski (Match Score 95%, vague sentence) and Marek Nowak (no sentence) stay outside; decision „W przeglądzie” saved; no console errors; 390 px without horizontal overflow.
