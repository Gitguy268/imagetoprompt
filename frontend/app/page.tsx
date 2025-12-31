'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import AnalysisDisplay from './components/AnalysisDisplay';
import ControlToggles, { type GeneratorOption } from './components/ControlToggles';
import { ErrorBoundary } from './components/ErrorBoundary';
import ExportPanel from './components/ExportPanel';
import PromptDisplay from './components/PromptDisplay';
import type { PromptPack } from './lib/types';

function nowIso() {
  return new Date().toISOString();
}

function buildSamplePack(enabled: Set<string>): PromptPack {
  const generators = [
    {
      id: 'sdxl',
      label: 'Stable Diffusion XL',
      prompt:
        'Ultra-detailed product photo of a ceramic mug on a wooden table, soft window light, shallow depth of field, 50mm, realistic textures, high resolution.',
      score: 0.86
    },
    {
      id: 'midjourney',
      label: 'Midjourney',
      prompt:
        'A cinematic still life photo of a handmade ceramic mug on a rustic wooden table, warm morning light, bokeh background, subtle film grain, crisp details.',
      score: 0.9
    },
    {
      id: 'dalle',
      label: 'DALL·E',
      prompt:
        'Photorealistic image of a ceramic mug on a wooden table in natural light. Emphasize realistic glaze texture, soft shadows, and a calm atmosphere.',
      score: 0.82
    }
  ].filter((g) => enabled.has(g.id));

  return {
    generatedAt: nowIso(),
    analysis: {
      summary:
        'The image appears to be a product-style photograph with soft natural lighting and a shallow depth of field, emphasizing texture and form.',
      attributes: {
        subject: 'Ceramic mug',
        style: 'Photorealistic product photo',
        lighting: 'Soft natural window light',
        composition: 'Centered subject, shallow depth of field'
      }
    },
    generators
  };
}

export default function HomePage() {
  const generatorOptions: GeneratorOption[] = useMemo(
    () => [
      { id: 'sdxl', label: 'Stable Diffusion XL' },
      { id: 'midjourney', label: 'Midjourney' },
      { id: 'dalle', label: 'DALL·E' }
    ],
    []
  );

  const [enabledGenerators, setEnabledGenerators] = useState<Set<string>>(
    () => new Set(generatorOptions.map((g) => g.id))
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [pack, setPack] = useState<PromptPack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const toggleGenerator = (id: string) => {
    setEnabledGenerators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setStatusMessage('Please upload an image before generating prompts.');
      return;
    }

    if (enabledGenerators.size === 0) {
      setStatusMessage('Select at least one generator.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Generating prompts…');

    await new Promise((r) => setTimeout(r, 650));

    setPack(buildSamplePack(enabledGenerators));
    setIsLoading(false);
    setStatusMessage('Prompts ready.');
  };

  const handleReset = () => {
    setPack(null);
    setStatusMessage('');
    setRetryKey((k) => k + 1);
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="h1">ImageToPrompt</h1>
          <p className="subtitle">Generate prompt packs and export them as .txt or .json.</p>
        </div>

        <span className="pill" aria-label="Accessibility status">
          WCAG AA-focused UI
        </span>
      </header>

      <main id="main" className="grid" aria-describedby="status">
        <section className="card" aria-labelledby="input-heading">
          <h2 id="input-heading">1) Upload</h2>

          <div className="field">
            <label className="label" htmlFor="image-upload">
              Image file
            </label>
            <input
              id="image-upload"
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.currentTarget.files?.[0] ?? null)}
            />
            <p className="help">Supported: any common image format (PNG, JPG, WebP).</p>
          </div>

          {!imagePreviewUrl ? (
            <p className="help">
              Upload an image to preview it here. Then choose generators and click “Generate prompts”.
            </p>
          ) : (
            <figure style={{ margin: '0.75rem 0 0' }}>
              <Image
                src={imagePreviewUrl}
                alt="Uploaded image preview"
                width={1200}
                height={900}
                unoptimized
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)'
                }}
              />
              <figcaption className="help" style={{ marginTop: '0.5rem' }}>
                Preview
              </figcaption>
            </figure>
          )}

          <div style={{ marginTop: '1rem' }}>
            <ControlToggles
              options={generatorOptions}
              enabled={enabledGenerators}
              onToggle={toggleGenerator}
            />
          </div>

          <div className="row" style={{ marginTop: '1rem' }}>
            <button className="btn btnPrimary" type="button" onClick={handleGenerate}>
              Generate prompts
            </button>
            <button className="btn" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>

          <p id="status" role="status" aria-live="polite" className="help" style={{ marginTop: '0.75rem' }}>
            {statusMessage}
          </p>
        </section>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <ErrorBoundary key={`analysis-${retryKey}`} onRetry={() => setRetryKey((k) => k + 1)}>
            <AnalysisDisplay pack={pack} isLoading={isLoading} />
          </ErrorBoundary>

          <ErrorBoundary key={`prompts-${retryKey}`} onRetry={() => setRetryKey((k) => k + 1)}>
            <PromptDisplay pack={pack} isLoading={isLoading} />
          </ErrorBoundary>

          <ExportPanel pack={pack} />
        </div>
      </main>

      <footer style={{ marginTop: '1.5rem' }}>
        <p className="help">
          Tip: Use keyboard navigation (Tab/Shift+Tab) to move through controls. Focus rings are enabled
          for all interactive elements.
        </p>
      </footer>
    </div>
  );
}
