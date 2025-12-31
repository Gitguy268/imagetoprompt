'use client';

import type { PromptPack } from '../lib/types';

type Props = {
  pack: PromptPack | null;
  isLoading: boolean;
};

function Skeleton() {
  return (
    <div className="card" aria-busy="true" aria-live="polite">
      <h2>Prompts</h2>
      <div className="help">Generating prompts…</div>
      <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem' }}>
        <div className="pill">Loading…</div>
        <div className="pill">Loading…</div>
        <div className="pill">Loading…</div>
      </div>
    </div>
  );
}

export default function PromptDisplay({ pack, isLoading }: Props) {
  if (isLoading) return <Skeleton />;

  if (!pack || pack.generators.length === 0) {
    return (
      <section className="card" aria-labelledby="prompts-heading">
        <h2 id="prompts-heading">Prompts</h2>
        <p className="help">No prompts yet. Upload an image and click “Generate prompts”.</p>
      </section>
    );
  }

  return (
    <section className="card fadeInUp" aria-labelledby="prompts-heading">
      <h2 id="prompts-heading">Prompts</h2>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {pack.generators.map((g) => (
          <article
            key={g.id}
            className="card"
            style={{ background: '#ffffff' }}
            aria-label={`${g.label} prompt`}
          >
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{g.label}</h3>
              {typeof g.score === 'number' ? (
                <span className="pill" aria-label={`${g.label} score ${g.score}`}>
                  Score: {g.score}
                </span>
              ) : null}
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <pre>{g.prompt}</pre>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
