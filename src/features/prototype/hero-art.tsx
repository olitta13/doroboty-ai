import { useEffect, useRef, useState, type CSSProperties } from "react";
import seated from "@/assets/hero/seated.webp";
import standing from "@/assets/hero/standing.webp";
import sparkCard from "@/assets/hero/spark-card.webp";
import sparkHead from "@/assets/hero/spark-head.webp";
import sparkSeat from "@/assets/hero/spark-seat.webp";

/*
 * Layered version of the Poster People "people" illustration
 * (docs/design-system/agent-kit/assets/people.png, left untouched).
 * Every layer keeps the full 1536x1024 canvas, so the layers line up exactly
 * and the static composition is identical to the original artwork.
 * Motion is decorative and switched off under prefers-reduced-motion.
 */
const layers = [
  { key: "seated", src: seated },
  { key: "standing", src: standing },
  { key: "spark-seat", src: sparkSeat },
  { key: "spark-card", src: sparkCard },
  { key: "spark-head", src: sparkHead },
] as const;

export function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);
  // On narrow screens the art sits below the fold: start its entrance when it is seen.
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="hero-art"
      data-in-view={inView ? "" : undefined}
      role="img"
      aria-label="Dwie osoby pracujące razem z laptopem"
    >
      <span className="hero-art__disc" aria-hidden="true" />
      {layers.map((layer) => (
        <span
          key={layer.key}
          className={`hero-art__layer hero-art__${layer.key}`}
          aria-hidden="true"
        >
          <img
            src={layer.src}
            alt=""
            width={1536}
            height={1024}
            decoding="async"
            draggable={false}
          />
        </span>
      ))}
    </div>
  );
}

const leadWords = ["Praca", "dla", "ludzi,", "którzy"];
const markedWords = ["dowożą", "z", "AI."];

function Word({ word, index }: { word: string; index: number }) {
  return (
    <span className="hero-word">
      <span style={{ "--word-index": index } as CSSProperties}>{word}</span>
    </span>
  );
}

/* Words rise from a mask one by one; the closing phrase gets a marker sweep. */
export function HeroHeadline() {
  return (
    <>
      {leadWords.map((word, index) => (
        <span key={word}>
          <Word word={word} index={index} />{" "}
        </span>
      ))}
      <span className="hero-mark">
        {markedWords.map((word, index) => (
          <span key={word}>
            <Word word={word} index={leadWords.length + index} />
            {index < markedWords.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}
