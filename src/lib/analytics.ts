import posthog from "posthog-js";

// Public PostHog project token: it is shipped to every visitor's browser by
// design and only allows sending events, so it is not a secret.
const POSTHOG_KEY = "phc_wfpUP7DrEHbxMXyazfPmYUfMXQkfqgwzfLuKRm7CGhw7";
const POSTHOG_HOST = "https://eu.i.posthog.com";

// Analytics run only on the production Netlify address. Local development,
// Playwright journeys and other mirrors (e.g. GitHub Pages) send nothing.
const TRACKED_HOSTNAMES = ["doroboty-aleksandra.netlify.app"];

export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!TRACKED_HOSTNAMES.includes(window.location.hostname)) return;
  if (!POSTHOG_KEY.startsWith("phc_")) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: "2025-05-24",
    // Hash routes change via history API; record each screen as a pageview.
    capture_pageview: "history_change",
    // Clicks on buttons and links only: form fields, text areas and record
    // content (CVs, notes) are never autocaptured.
    autocapture: { element_allowlist: ["a", "button"] },
    // No cookies or localStorage: no consent banner needed for this prototype,
    // at the cost of counting each visit as a new anonymous visitor.
    persistence: "memory",
    person_profiles: "identified_only",
    // Session replay would record typed free text; keep it off.
    disable_session_recording: true,
    mask_all_text: false,
    mask_all_element_attributes: false,
  });
}
