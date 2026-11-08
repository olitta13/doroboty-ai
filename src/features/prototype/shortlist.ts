import type { Application } from "./model";
import { MIN_CONTRIBUTION_LENGTH } from "./constants";
export { MIN_CONTRIBUTION_LENGTH };

/**
 * Shortlist by own contribution (prototype P1).
 *
 * SIMULATION: the order is a transparent rule over the candidate's own sentence,
 * not a model judgement and not a hiring probability. It rewards a concrete
 * first-person action, a clear boundary against other people's work and a number,
 * and penalises vague phrasing. Employers always keep access to all applications.
 */
export const SHORTLIST_SIZE = 5;

export type ContributionSignal = "own-action" | "boundary" | "numbers" | "vague";

export const contributionSignalLabels: Record<ContributionSignal, string> = {
  "own-action": "Konkretna własna czynność",
  boundary: "Oddziela pracę innych",
  numbers: "Liczby lub skala",
  vague: "Ogólnikowe sformułowania",
};

const LETTERS = "a-ząćęłńóśźż";
const ownAction = new RegExp(
  `(^|[^${LETTERS}])(sama|sam|samodzielnie)([^${LETTERS}]|$)|[${LETTERS}]+(łam|łem)([^${LETTERS}]|$)`,
  "iu",
);
const beingOnly = /(^|\s)(byłam|byłem)(\s|$)/iu;
const otherPeople = new RegExp(
  `(^|[^${LETTERS}])(zespół|zespołu|it|kolega|koleżanka|dyrektor[${LETTERS}]*|partner[${LETTERS}]*|radca|radczyni)([^${LETTERS}]|$)`,
  "iu",
);
const thirdPersonPast = new RegExp(`[${LETTERS}]+ł(a)?([^${LETTERS}]|$)`, "iu");
const vague =
  /(częścią zespołu|wspierałem|wspierałam|transformacj[aęi] ai|wiele zespołów|innowacyjn|kompleksow|synergi)/iu;

export function contributionSignals(sentence: string): ContributionSignal[] {
  const text = sentence.trim();
  if (!text) return [];
  const signals: ContributionSignal[] = [];
  const withoutBeing = text.replace(beingOnly, " ");
  if (ownAction.test(withoutBeing)) signals.push("own-action");
  if (otherPeople.test(text) && thirdPersonPast.test(text)) signals.push("boundary");
  if (/\d/.test(text)) signals.push("numbers");
  if (vague.test(text)) signals.push("vague");
  return signals;
}

export function contributionRank(sentence: string): number {
  const text = sentence.trim();
  if (text.length < MIN_CONTRIBUTION_LENGTH) return 0;
  const signals = contributionSignals(text);
  let score = text.length <= 260 ? 2 : 1;
  if (signals.includes("own-action")) score += 3;
  if (signals.includes("boundary")) score += 2;
  if (signals.includes("numbers")) score += 1;
  if (signals.includes("vague")) score -= 4;
  return Math.max(0, score);
}

const closedStages = new Set(["rejected", "withdrawn", "hired"]);

export type ShortlistEntry = {
  application: Application;
  rank: number;
  signals: ContributionSignal[];
};

/** Splits one job's applications into the shortlist and the rest, without hiding anyone. */
export function buildShortlist(applications: Application[]) {
  const described = applications
    .filter(
      (a) => !closedStages.has(a.stage) && a.contribution.trim().length >= MIN_CONTRIBUTION_LENGTH,
    )
    .map((application) => ({
      application,
      rank: contributionRank(application.contribution),
      signals: contributionSignals(application.contribution),
    }))
    .sort(
      (a, b) =>
        b.rank - a.rank ||
        a.application.events[0].at.localeCompare(b.application.events[0].at) ||
        a.application.id.localeCompare(b.application.id),
    );
  const shortlist = described.slice(0, SHORTLIST_SIZE);
  const shortlisted = new Set(shortlist.map((x) => x.application.id));
  const withoutContribution = applications.filter(
    (a) => !closedStages.has(a.stage) && a.contribution.trim().length < MIN_CONTRIBUTION_LENGTH,
  );
  const others = applications.filter((a) => !shortlisted.has(a.id));
  return { shortlist, others, withoutContribution };
}

/** Prepared synthetic applicants used to test the shortlist (SIMULATION, not real people). */
export const demoApplicants = [
  {
    key: "julia",
    name: "Julia Mazur",
    headline: "Product Manager · procesy rekrutacyjne",
    score: 78,
    contribution:
      "Sama przeprowadziłam 12 wywiadów z rekruterami i na ich podstawie zaprojektowałam nowy proces oceny zgłoszeń; integrację z systemem ATS zrobił zespół IT.",
    answer:
      "Prowadziłam discovery dla narzędzia do oceny zgłoszeń. Chętnie pokażę, jak z wywiadów powstały kryteria oceny i co zmieniło się w procesie.",
    summary: "Doświadczenie w badaniach i projektowaniu procesów. Warto dopytać o pomiar efektów.",
  },
  {
    key: "piotr",
    name: "Piotr Lewandowski",
    headline: "Head of AI Transformation",
    score: 93,
    contribution:
      "Odpowiadałem za transformację AI w organizacji i wspierałem wiele zespołów we wdrażaniu innowacyjnych rozwiązań.",
    answer:
      "Mam szerokie doświadczenie w transformacji cyfrowej i wdrażaniu AI w dużych organizacjach. Lubię pracę z interesariuszami.",
    summary: "Szeroki zakres odpowiedzialności. Własny wkład w konkretne wdrożenie niejasny.",
  },
  {
    key: "ola",
    name: "Aleksandra Krawczyk",
    headline: "Product Owner · obsługa klienta",
    score: 81,
    contribution:
      "Napisałam specyfikację i prompty asystenta do odpowiedzi na zgłoszenia klientów; model i budżet wybierał dyrektor produktu.",
    answer:
      "Rozwijałam asystenta dla zespołu obsługi klienta. Mogę opowiedzieć, jak testowaliśmy odpowiedzi i jakie były ograniczenia.",
    summary: "Praktyka w pracy z asystentem AI. Warto dopytać o wyniki użycia.",
  },
  {
    key: "kamil",
    name: "Kamil Wójcik",
    headline: "Product Analyst · automatyzacja",
    score: 88,
    contribution:
      "Zmierzyłem, że po wdrożeniu asystenta czas odpowiedzi spadł z 9 do 4 godzin, i przygotowałem raport dla zarządu.",
    answer:
      "Specjalizuję się w mierzeniu efektów wdrożeń. W ostatnim projekcie odpowiadałem za analizę danych przed i po zmianie.",
    summary: "Mocny w analityce efektów. Mniej informacji o pracy produktowej.",
  },
  {
    key: "natalia",
    name: "Natalia Pawlak",
    headline: "Product Designer · AI",
    score: 70,
    contribution:
      "Przygotowałam i przetestowałam z 5 użytkownikami prototyp wyszukiwarki dokumentów; backend budował kolega z zespołu.",
    answer:
      "Łączę projektowanie z testami użytkowników. Chętnie pokażę prototyp i wnioski z testów.",
    summary: "Doświadczenie w prototypowaniu i testach. Warto dopytać o zakres produktowy.",
  },
  {
    key: "michal",
    name: "Michał Grabowski",
    headline: "AI Product Lead",
    score: 95,
    contribution: "Byłem częścią zespołu, który zbudował platformę AI.",
    answer:
      "Od kilku lat pracuję przy produktach AI. Znam cały cykl życia produktu i współpracę z inżynierami.",
    summary: "Wysoka ocena tekstu. Własny wkład nieopisany.",
  },
] as const;

export const DEMO_PREFIX = "demo-";
