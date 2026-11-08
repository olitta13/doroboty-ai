import { describe, expect, it } from "vitest";
import { initialState, transition } from "./model";
import { buildShortlist, contributionRank, contributionSignals, SHORTLIST_SIZE } from "./shortlist";

describe("shortlist by own contribution (simulation rule)", () => {
  it("rewards a concrete own action separated from other people's work", () => {
    const concrete =
      "Sama przeprowadziłam 12 wywiadów i zaprojektowałam proces; integrację zrobił zespół IT.";
    expect(contributionSignals(concrete)).toEqual(["own-action", "boundary", "numbers"]);
    expect(contributionRank(concrete)).toBeGreaterThan(
      contributionRank("Byłem częścią zespołu, który zbudował platformę AI."),
    );
  });
  it("flags vague phrasing and ignores too-short sentences", () => {
    expect(
      contributionSignals("Wspierałem wiele zespołów we wdrażaniu innowacyjnych rozwiązań."),
    ).toContain("vague");
    expect(contributionRank("Zrobiłem to.")).toBe(0);
  });
  it("seeds prepared applicants and keeps everyone reachable outside the shortlist", () => {
    let s = transition(initialState(), { type: "select_person", id: "employer-brightlabs" });
    const job = s.jobs[0];
    s = transition(s, { type: "seed_shortlist", jobId: job.id }, "2026-11-08T10:00:00.000Z");
    s = transition(s, { type: "seed_shortlist", jobId: job.id }, "2026-11-08T11:00:00.000Z");
    const applications = s.applications.filter((a) => a.jobId === job.id);
    expect(applications).toHaveLength(7);
    const { shortlist, others, withoutContribution } = buildShortlist(applications);
    expect(shortlist).toHaveLength(SHORTLIST_SIZE);
    expect(shortlist[0].application.candidateName).toBe("Julia Mazur");
    expect(shortlist.map((x) => x.application.candidateName)).not.toContain("Michał Grabowski");
    expect(withoutContribution.map((x) => x.candidateName)).toEqual(["Marek Nowak"]);
    expect(shortlist.length + others.length).toBe(applications.length);
  });
  it("rejects seeding another company's offer", () => {
    const s = transition(initialState(), { type: "select_person", id: "employer-brightlabs" });
    const foreign = s.jobs.find((j) => j.companyId !== s.people[2].companyId)!;
    expect(() => transition(s, { type: "seed_shortlist", jobId: foreign.id })).toThrow();
  });
});
