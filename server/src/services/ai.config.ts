// Configuration for AI service with reduced token limits

export const AI_CONFIG = {
  // Reduce max tokens to fit within credit limits
  maxTokens: 2500, // Reduced from 4096 to stay under the 2559 limit
  temperature: 0.7,
  // Other configuration options...
};