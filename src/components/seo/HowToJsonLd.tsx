import { JsonLd } from "./JsonLd";

export type HowToStep = {
  name: string;
  text: string;
  url?: string;
};

export function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        ...(totalTime ? { totalTime } : {}),
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
          ...(s.url ? { url: s.url } : {}),
        })),
      }}
    />
  );
}
