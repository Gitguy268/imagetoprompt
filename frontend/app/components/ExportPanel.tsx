'use client';

import { useMemo, useState } from 'react';
import type { PromptPack } from '../lib/types';
import {
  buildTimestampFilename,
  copyTextToClipboard,
  downloadTextFile,
  formatPromptPackAsJson,
  formatPromptPackAsTxt
} from '../lib/export';

type Props = {
  pack: PromptPack | null;
};

function supportsDownloadAttribute() {
  if (typeof document === 'undefined') return false;
  return 'download' in document.createElement('a');
}

export default function ExportPanel({ pack }: Props) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const canDownload = useMemo(() => supportsDownloadAttribute(), []);

  const hasData = Boolean(pack && pack.generators.length > 0);

  const getTxt = () => {
    if (!pack) throw new Error('No data to export.');
    return formatPromptPackAsTxt(pack);
  };

  const getJson = () => {
    if (!pack) throw new Error('No data to export.');
    return formatPromptPackAsJson(pack);
  };

  const downloadOrCopy = async (extension: 'txt' | 'json') => {
    if (!hasData || !pack) return;

    const content = extension === 'txt' ? getTxt() : getJson();
    const filename = buildTimestampFilename(extension);

    try {
      if (!canDownload) {
        await copyTextToClipboard(content);
        setStatusMessage(`Download not available. Copied ${extension.toUpperCase()} to clipboard.`);
        return;
      }

      downloadTextFile(filename, content);
      setStatusMessage(`Downloaded ${filename}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Export failed:', err);
      try {
        await copyTextToClipboard(content);
        setStatusMessage(`Download failed. Copied ${extension.toUpperCase()} to clipboard instead.`);
      } catch (copyErr) {
        // eslint-disable-next-line no-console
        console.error('Copy to clipboard failed:', copyErr);
        setStatusMessage('Export failed. Please try again.');
      }
    }
  };

  const copy = async (extension: 'txt' | 'json') => {
    if (!hasData || !pack) return;
    const content = extension === 'txt' ? getTxt() : getJson();

    try {
      await copyTextToClipboard(content);
      setStatusMessage(`Copied ${extension.toUpperCase()} to clipboard.`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Copy failed:', err);
      setStatusMessage('Copy failed. Please try again.');
    }
  };

  return (
    <section className="card" aria-labelledby="export-heading">
      <h2 id="export-heading">Export</h2>

      {!hasData ? (
        <p className="help">Generate prompts first to enable export.</p>
      ) : (
        <p className="help">Export your prompt pack as a .txt or .json file.</p>
      )}

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={() => downloadOrCopy('txt')}
          disabled={!hasData}
        >
          Download .txt
        </button>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={() => downloadOrCopy('json')}
          disabled={!hasData}
        >
          Download .json
        </button>
        <button type="button" className="btn" onClick={() => copy('txt')} disabled={!hasData}>
          Copy .txt
        </button>
        <button type="button" className="btn" onClick={() => copy('json')} disabled={!hasData}>
          Copy .json
        </button>
      </div>

      <p role="status" aria-live="polite" className="help" style={{ marginTop: '0.75rem' }}>
        {statusMessage ?? ''}
      </p>
    </section>
  );
}
