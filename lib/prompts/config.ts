/**
 * Prompt Configuration for TalkerApp
 * 
 * Controls personality, analysis depth, and behavior of the AI processor.
 * Edit .env.local to change defaults during testing phase.
 */

export type ToneVariant = 'warm' | 'professional' | 'balanced';
export type AnalysisDepth = 'surface' | 'deep';
export type Language = 'pt-BR' | 'en-US';

export interface PromptConfig {
  /** Personality tone for AI responses */
  tone: ToneVariant;
  
  /** Depth of psychological analysis */
  analysisDepth: AnalysisDepth;
  
  /** Include OCEAN personality analysis */
  includeOcean: boolean;
  
  /** Language and cultural context */
  language: Language;
  
  /** Custom instructions to append (for experiments) */
  customInstructions?: string;
}

/**
 * Default configuration - can be overridden by environment variables
 */
export const DEFAULT_CONFIG: PromptConfig = {
  tone: (process.env.NEXT_PUBLIC_PROMPT_TONE as ToneVariant) || 'balanced',
  analysisDepth: (process.env.NEXT_PUBLIC_PROMPT_DEPTH as AnalysisDepth) || 'deep',
  includeOcean: process.env.NEXT_PUBLIC_PROMPT_INCLUDE_OCEAN !== 'false',
  language: 'pt-BR'
};

/**
 * Preset configurations for A/B testing
 */
export const PRESETS = {
  /** Empathetic, supportive coach */
  empathetic: {
    tone: 'warm',
    analysisDepth: 'deep',
    includeOcean: true,
    language: 'pt-BR'
  } as PromptConfig,
  
  /** Clinical, analytical professional */
  clinical: {
    tone: 'professional',
    analysisDepth: 'deep',
    includeOcean: true,
    language: 'pt-BR'
  } as PromptConfig,
  
  /** Quick processing without deep analysis */
  quick: {
    tone: 'balanced',
    analysisDepth: 'surface',
    includeOcean: false,
    language: 'pt-BR'
  } as PromptConfig
};
