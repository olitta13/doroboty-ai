import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}
interface State {
  failed: boolean;
}

/*
 * Last-resort recovery screen. Without it a render error unmounts the whole
 * React tree and visitors see a blank page. The prototype sends no telemetry,
 * so the error is only written to this browser's console, without any of the
 * visitor's free text (error name and component stack only).
 */
export class PrototypeErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[DoRoboty.ai] Błąd ekranu:", error.name, info.componentStack ?? "");
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.handleNavigate);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleNavigate);
  }

  handleNavigate = () => {
    if (this.state.failed) this.setState({ failed: false });
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
        <section className="prototype-panel" role="alert" aria-labelledby="app-error-title">
          <h1 id="app-error-title" className="text-3xl font-semibold">
            Ten ekran napotkał błąd
          </h1>
          <p className="mt-4 text-muted-foreground">
            Dane zapisane w tej przeglądarce nie zostały usunięte. Odśwież stronę albo przejdź do
            ustawień, aby pobrać kopię scenariusza przed dalszą pracą.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => window.location.reload()}>Odśwież stronę</Button>
            <a className={buttonVariants({ variant: "outline" })} href="#/app/settings">
              Ustawienia i eksport danych
            </a>
            <a className={buttonVariants({ variant: "ghost" })} href="#/">
              Strona główna
            </a>
          </div>
        </section>
      </main>
    );
  }
}
