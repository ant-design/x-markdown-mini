import remend from 'remend';
import type { SemanticStreamingConfig, StreamingConfig } from '../types.js';

/**
 * Streaming tail preprocessor:
 * - 'remend' (default): auto-completes unfinished markdown tail syntax
 * - false: disables fixup
 * - function: custom tail preprocessor
 */
export type StreamingFixup = 'remend' | false | ((text: string) => string);

export interface NormalizedStreamingConfig {
  hasNextChunk: boolean;
  semanticEnabled: boolean;
  semanticConfig: SemanticStreamingConfig;
  enableAnimation: boolean;
}

export function resolveStreamingFixup(
  fixup: StreamingFixup,
): ((text: string) => string) | undefined {
  if (fixup === false) return undefined;
  if (fixup === 'remend') return (s: string) => remend(s);
  return fixup;
}

export function normalizeStreamingConfig(
  streaming: false | true | StreamingConfig | undefined,
): NormalizedStreamingConfig | null {
  if (!streaming) return null;

  if (streaming === true) {
    return {
      hasNextChunk: true,
      semanticEnabled: true,
      semanticConfig: {},
      enableAnimation: true,
    };
  }

  const semantic = streaming.semantic ?? true;
  const baseSemanticConfig: SemanticStreamingConfig = {
    delimiters: streaming.delimiters,
    maxChunkSize: streaming.maxChunkSize,
    chunkDelay: streaming.chunkDelay,
    charDelay: streaming.charDelay,
  };
  return {
    hasNextChunk: streaming.hasNextChunk,
    semanticEnabled: semantic !== false,
    semanticConfig: {
      ...baseSemanticConfig,
      ...(typeof semantic === 'object' ? semantic : {}),
    },
    enableAnimation: streaming.enableAnimation ?? true,
  };
}
