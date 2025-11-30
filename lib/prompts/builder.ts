import fs from 'fs';
import path from 'path';
import { PromptConfig, DEFAULT_CONFIG } from './config';

/**
 * PromptBuilder - Composes AI prompts from modular templates
 * 
 * Loads markdown templates from disk and assembles them based on configuration.
 * Designed for rapid iteration during testing phase.
 */
export class PromptBuilder {
  private config: PromptConfig;
  private templates: Map<string, string> = new Map();
  private templatesDir: string;
  
  constructor(config: PromptConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.templatesDir = path.join(process.cwd(), 'lib/prompts');
    this.loadTemplates();
  }
  
  /**
   * Load all template files from disk
   */
  private loadTemplates(): void {
    const baseTemplates = [
      'templates/00-base.md',
      'templates/10-processing-rules.md',
      'templates/20-psychology-framework.md',
      'templates/30-output-format.md',
      'templates/40-ethical-guidelines.md'
    ];
    
    baseTemplates.forEach(file => {
      try {
        const filePath = path.join(this.templatesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const key = path.basename(file, '.md');
        this.templates.set(key, content);
      } catch (error) {
        console.error(`Failed to load template ${file}:`, error);
      }
    });
  }
  
  /**
   * Load a variant file (tone or depth)
   */
  private loadVariant(type: 'tone' | 'depth', variant: string): string {
    try {
      const filePath = path.join(this.templatesDir, 'variants', type, `${variant}.md`);
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Failed to load variant ${type}/${variant}:`, error);
      return '';
    }
  }
  
  /**
   * Build complete prompt with transcription
   */
  build(transcription: string): string {
    const sections = [
      // Base identity
      this.templates.get('00-base'),
      
      // Personality tone
      this.loadVariant('tone', this.config.tone),
      
      // Processing rules
      this.templates.get('10-processing-rules'),
      
      // Psychology framework (conditional)
      this.config.includeOcean ? this.templates.get('20-psychology-framework') : null,
      
      // Analysis depth
      this.loadVariant('depth', this.config.analysisDepth),
      
      // Transcription
      this.formatTranscription(transcription),
      
      // Output format
      this.templates.get('30-output-format'),
      
      // Ethical guidelines
      this.templates.get('40-ethical-guidelines'),
      
      // Custom instructions (if any)
      this.config.customInstructions
    ];
    
    return sections
      .filter(section => section && section.trim().length > 0)
      .join('\n\n---\n\n');
  }
  
  /**
   * Format transcription section
   */
  private formatTranscription(text: string): string {
    return `## Transcrição de Áudio Recebida

<audio_transcript>
${text}
</audio_transcript>`;
  }
  
  /**
   * Get current configuration
   */
  getConfig(): PromptConfig {
    return { ...this.config };
  }
  
  /**
   * Update configuration (useful for testing)
   */
  setConfig(config: Partial<PromptConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Convenience function to build prompt with default config
 */
export function buildPrompt(transcription: string, config?: Partial<PromptConfig>): string {
  const fullConfig = config ? { ...DEFAULT_CONFIG, ...config } : DEFAULT_CONFIG;
  const builder = new PromptBuilder(fullConfig);
  return builder.build(transcription);
}
