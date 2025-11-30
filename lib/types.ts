/**
 * Type definitions for TalkerApp processing results
 */

export interface ProcessedResult {
  processedText: string;
  analysis: string;
  explanation: string;
}

export interface OceanScores {
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
}

export interface PsychologicalElement {
  element_type: 'cognitive_bias' | 'defense_mechanism' | 'attachment_pattern' | 'regulation_strategy';
  element_name: string;
  confidence: number;
  evidence?: string;
}

export interface SessionData {
  transcription: string;
  processed_text: string;
  analysis: string;
  audio_duration_seconds?: number;
  ocean_scores?: OceanScores;
  themes?: string[];
  psychological_elements?: PsychologicalElement[];
}
