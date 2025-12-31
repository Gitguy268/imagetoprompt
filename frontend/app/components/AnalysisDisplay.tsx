'use client';

import type { PromptPack } from '../lib/types';

type Props = {
  pack: PromptPack | null;
  isLoading: boolean;
};

function Skeleton() {
  return (
    <div className="card" aria-busy="true" aria-live="polite">
      <h2>Analysis</h2>
      <div className="help">Analyzing image…</div>
      <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
        <div className="pill">Loading…</div>
        <div className="pill">Loading…</div>
      </div>
    </div>
  );
}

export default function AnalysisDisplay({ pack, isLoading }: Props) {
  if (isLoading) return <Skeleton />;

  if (!pack || !pack.analysis) {
    return (
      <section className="card" aria-labelledby="analysis-heading">
        <h2 id="analysis-heading">Analysis</h2>
        <p className="help">No analysis yet. Generate prompts to see a structured analysis.</p>
      </section>
    );
  }

  const { summary, attributes } = pack.analysis;

  return (
    <section className="card fadeInUp" aria-labelledby="analysis-heading">
      <h2 id="analysis-heading">Analysis</h2>
      <p style={{ marginTop: 0 }}>{summary}</p>

      {attributes && Object.keys(attributes).length > 0 ? (
        <dl style={{ margin: '0.75rem 0 0', display: 'grid', gap: '0.5rem' }}>
          {Object.entries(attributes).map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem' }}>
              <dt style={{ fontWeight: 700 }}>{k}</dt>
              <dd style={{ margin: 0, color: 'var(--muted)' }}>{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
