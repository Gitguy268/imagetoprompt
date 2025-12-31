import type { PromptPack } from './types';

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

export function buildTimestampFilename(extension: 'txt' | 'json', date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const min = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());

  return `prompts_${yyyy}-${mm}-${dd}_${hh}${min}${ss}.${extension}`;
}

export function formatPromptPackAsTxt(pack: PromptPack) {
  const lines: string[] = [];

  lines.push('ImageToPrompt Export');
  lines.push(`Generated at: ${pack.generatedAt}`);

  if (pack.analysis) {
    lines.push('');
    lines.push('Analysis');
    lines.push('--------');
    lines.push(pack.analysis.summary);

    if (pack.analysis.attributes && Object.keys(pack.analysis.attributes).length > 0) {
      lines.push('');
      lines.push('Attributes');
      for (const [key, value] of Object.entries(pack.analysis.attributes)) {
        lines.push(`- ${key}: ${value}`);
      }
    }
  }

  lines.push('');
  lines.push('Prompts');
  lines.push('-------');

  const sections = pack.generators.map((g) => {
    const section: string[] = [];
    section.push(`${g.label}`);
    if (typeof g.score === 'number') {
      section.push(`Score: ${g.score}`);
    }
    section.push('');
    section.push(g.prompt.trim());
    return section.join('\n');
  });

  lines.push(sections.join('\n\n---\n\n'));

  return lines.join('\n');
}

export function formatPromptPackAsJson(pack: PromptPack) {
  const prompts: Record<string, string> = {};
  const scores: Record<string, number | null> = {};

  for (const g of pack.generators) {
    prompts[g.id] = g.prompt;
    scores[g.id] = typeof g.score === 'number' ? g.score : null;
  }

  const payload = {
    generatedAt: pack.generatedAt,
    analysis: pack.analysis,
    prompts,
    scores
  };

  return JSON.stringify(payload, null, 2);
}

export async function copyTextToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!ok) {
    throw new Error('Copy to clipboard failed.');
  }
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
