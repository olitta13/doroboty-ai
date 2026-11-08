import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { Tabs } from "@base-ui/react/tabs";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { currentPerson, stageLabels } from "./model";
import { MatchScore } from "./match-score";
import { usePrototype } from "./store";
import { Empty, PageTitle } from "./shell";
import { SHORTLIST_SIZE, buildShortlist, contributionSignalLabels } from "./shortlist";

/** Employer candidates view with the P1 shortlist by own contribution. */
export function EmployerShortlist({ allApplications }: { allApplications: ReactNode }) {
  const { state, run } = usePrototype();
  const person = currentPerson(state)!;
  const [params, setParams] = useSearchParams();
  const [announcement, setAnnouncement] = useState("");
  const view = params.get("widok") === "wszystkie" ? "all" : "shortlist";
  const onlyJob = params.get("oferta");
  const jobs = state.jobs.filter(
    (job) =>
      job.companyId === person.companyId &&
      job.publicationStatus === "published" &&
      (!onlyJob || job.id === onlyJob),
  );

  return (
    <>
      <PageTitle>Kandydaci</PageTitle>
      <Tabs.Root
        value={view}
        onValueChange={(value) => {
          const next = new URLSearchParams(params);
          if (value === "all") next.set("widok", "wszystkie");
          else next.delete("widok");
          setParams(next, { replace: true });
        }}
      >
        <Tabs.List className="record-tabs" aria-label="Widok kandydatów" activateOnFocus>
          <Tabs.Tab value="shortlist" className="record-tab" render={<Button variant="ghost" />}>
            Krótka lista
          </Tabs.Tab>
          <Tabs.Tab value="all" className="record-tab" render={<Button variant="ghost" />}>
            Wszystkie zgłoszenia
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="shortlist" className="shortlist-panel">
          <p className="shortlist-intro">
            Każdy kandydat jednym zdaniem opisuje, co w projekcie zrobił sam. Zacznij od pięciu
            osób, które opisały to najkonkretniej.{" "}
            <span className="shortlist-simulation">
              Prototyp: kolejność wynika z prostej reguły (konkretna czynność, oddzielenie pracy
              innych, liczby), nie z oceny modelu AI ani prawdopodobieństwa zatrudnienia.
            </span>
          </p>
          {jobs.length ? (
            jobs.map((job) => {
              const applications = state.applications.filter((a) => a.jobId === job.id);
              const { shortlist, others, withoutContribution } = buildShortlist(applications);
              const headingId = `shortlist-${job.id}`;
              return (
                <section key={job.id} className="shortlist-job" aria-labelledby={headingId}>
                  <header className="shortlist-job-header">
                    <h2 id={headingId}>{job.title}</h2>
                    <p>
                      {applications.length} zgłoszeń · na krótkiej liście {shortlist.length} z{" "}
                      {SHORTLIST_SIZE}
                    </p>
                  </header>
                  {shortlist.length ? (
                    <ol className="shortlist-list">
                      {shortlist.map(({ application, signals }, index) => (
                        <li key={application.id} className="prototype-panel shortlist-card">
                          <div className="shortlist-card-head">
                            <span className="shortlist-rank" aria-label={`Miejsce ${index + 1}`}>
                              {index + 1}
                            </span>
                            <div className="shortlist-who">
                              <Link
                                className="shortlist-name"
                                to={`/app/kandydaci/${application.id}`}
                              >
                                {application.candidateName}
                              </Link>
                              <span className="shortlist-stage">
                                {stageLabels[application.stage]}
                              </span>
                            </div>
                            <div className="shortlist-score">
                              <MatchScore score={application.score} />
                            </div>
                          </div>
                          <figure className="contribution-quote">
                            <blockquote>
                              <p>„{application.contribution}”</p>
                            </blockquote>
                            <figcaption>Mój wkład — zdanie kandydata</figcaption>
                          </figure>
                          <div className="shortlist-card-foot">
                            <ul className="shortlist-signals" aria-label="Co widać w opisie">
                              {signals.map((signal) => (
                                <li key={signal}>
                                  <Badge variant={signal === "vague" ? "outline" : "secondary"}>
                                    {contributionSignalLabels[signal]}
                                  </Badge>
                                </li>
                              ))}
                            </ul>
                            <Link
                              to={`/app/kandydaci/${application.id}`}
                              className={buttonVariants({ size: "sm" })}
                            >
                              Zobacz zgłoszenie
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <Empty>Nikt jeszcze nie opisał własnego wkładu w tej ofercie.</Empty>
                  )}
                  <p className="shortlist-rest">
                    Poza krótką listą: {others.length}
                    {withoutContribution.length
                      ? ` (w tym ${withoutContribution.length} bez opisu wkładu)`
                      : ""}
                    .{" "}
                    <Link
                      className="text-link"
                      to={`/app/kandydaci?widok=wszystkie${onlyJob ? `&oferta=${onlyJob}` : ""}`}
                    >
                      Zobacz wszystkie zgłoszenia
                    </Link>
                  </p>
                  {applications.filter((a) => a.contribution.trim()).length < SHORTLIST_SIZE && (
                    <div className="shortlist-seed">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (run({ type: "seed_shortlist", jobId: job.id }))
                            setAnnouncement(
                              `Dodano przykładowe zgłoszenia do oferty ${job.title}.`,
                            );
                        }}
                      >
                        Dodaj przykładowe zgłoszenia do testu
                      </Button>
                      <span>Symulacja: 6 syntetycznych kandydatów z przygotowanymi danymi.</span>
                    </div>
                  )}
                </section>
              );
            })
          ) : (
            <Empty>Nie masz opublikowanych ofert.</Empty>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="all">{allApplications}</Tabs.Panel>
      </Tabs.Root>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
