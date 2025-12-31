'use client';

import type { GeneratorPrompt } from '../lib/types';

export type GeneratorOption = {
  id: GeneratorPrompt['id'];
  label: string;
};

type Props = {
  options: GeneratorOption[];
  enabled: Set<string>;
  onToggle: (id: string) => void;
};

export default function ControlToggles({ options, enabled, onToggle }: Props) {
  return (
    <fieldset className="card" aria-describedby="generators-help">
      <legend style={{ fontWeight: 700, fontSize: '1.125rem' }}>Generators</legend>
      <p id="generators-help" className="help" style={{ marginTop: '0.25rem' }}>
        Choose which generators to include in the prompt pack.
      </p>

      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
        {options.map((opt) => {
          const id = `gen-${opt.id}`;
          return (
            <label
              key={opt.id}
              htmlFor={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                minHeight: '44px'
              }}
            >
              <input
                id={id}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                type="checkbox"
                checked={enabled.has(opt.id)}
                onChange={() => onToggle(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
