# PostHog analytics on the production address

## Intent

Record pageviews and clicks of the published prototype in PostHog so the owner
can see real visits on https://doroboty-aleksandra.netlify.app.

## Acceptance criteria

- `posthog-js` initialises only on `doroboty-aleksandra.netlify.app`; local
  development, Playwright journeys and GitHub Pages send no events.
- Each hash-route screen is captured as `$pageview`; clicks are captured by
  autocapture as `$autocapture`.
- No cookies or localStorage (`persistence: "memory"`), no session replay, no
  free text from form fields is sent.
- A pageview and a click from the production address are visible in the
  PostHog project's activity view.

## Verification

`npm run check`; after the Netlify deploy, a manual visit and click on the
production address and the matching events in PostHog.
