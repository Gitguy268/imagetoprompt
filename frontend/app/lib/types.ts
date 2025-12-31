export type GeneratorPrompt = {
  id: string;
  label: string;
  prompt: string;
  score?: number | null;
};

export type AnalysisResult = {
  summary: string;
  attributes?: Record<string, string>;
};

export type PromptPack = {
  generatedAt: string;
  analysis: AnalysisResult | null;
  generators: GeneratorPrompt[];
};
