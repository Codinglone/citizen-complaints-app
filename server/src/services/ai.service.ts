import axios from 'axios';
import { logger } from '../utility/logger';
import { CategoryModel } from '../model/category.model';
import { AgencyModel } from '../model/agency.model';

interface AIAnalysisResult {
  suggestedCategoryId: string | null;
  suggestedAgencyId: string | null;
  confidence: number;
  sentimentScore: number;
  language: string;
}

export class AIService {
  private static apiKey = process.env.OPENROUTER_API_KEY;
  private static model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-sonnet';

  static async analyzeComplaint(
    title: string,
    description: string,
    location: string
  ): Promise<AIAnalysisResult> {
    try {
      // Skip AI if API key is not set
      if (!this.apiKey) {
        logger.warn('OpenRouter API key not set, returning default values');
        return {
          suggestedCategoryId: null,
          suggestedAgencyId: null,
          confidence: 0,
          sentimentScore: 0,
          language: 'en'
        };
      }
      
      // Get all categories and agencies for context
      const categories = await CategoryModel.getAll();
      const agencies = await AgencyModel.getAll();
      
      // Log available data for context
      logger.info(`Found ${categories.length} categories and ${agencies.length} agencies for AI context`);
      
      // Log a few examples of the data we're providing to the AI
      if (categories.length > 0) {
        logger.info('Sample category:', categories[0]);
      }
      if (agencies.length > 0) {
        logger.info('Sample agency:', agencies[0]);
      }

      // Format categories and agencies for the prompt
      const categoriesText = categories.map(c => `- ${c.id}: ${c.name}${c.description ? ' - ' + c.description : ''}`).join('\n');
      const agenciesText = agencies.map(a => 
        `- ${a.id}: ${a.name}${a.description ? ' - ' + a.description : ''}`
      ).join('\n');

      // Improve the prompt to be more explicit
      const prompt = `
      You are an AI assistant for a government complaint management system. Analyze this citizen complaint and identify the most appropriate category and agency to handle it.
      
      COMPLAINT TITLE: ${title}
      COMPLAINT DESCRIPTION: ${description}
      LOCATION: ${location}
      
      AVAILABLE CATEGORIES:
      ${categoriesText}
      
      AVAILABLE AGENCIES:
      ${agenciesText}
      
      Based on the complaint content, please analyze and provide:
      
      1. The categoryId that best matches this complaint
      2. The agencyId that should handle this complaint
      3. A confidence score (0-100) for your suggestion
      4. A sentiment score (-100 to 100) for the complaint tone
      5. The detected language code (e.g., 'en', 'fr', 'es')
      
      FORMAT YOUR RESPONSE AS A JSON OBJECT WITH THESE EXACT FIELDS:
      {
        "categoryId": "the-category-id-string",
        "agencyId": "the-agency-id-string",
        "confidence": number-between-0-and-100,
        "sentimentScore": number-between-negative-100-and-100,
        "language": "language-code"
      }
      
      IMPORTANT: Use only the ids from the lists above. Respond ONLY with this JSON object, no explanations or other text.
      `;
      
      logger.info('Sending prompt to OpenRouter AI:', prompt);

      // Call OpenRouter API with timeout
      const axiosInstance = axios.create({ timeout: 20000 }); // Increase timeout
      const response = await axiosInstance.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://citizen-complaints-app.onrender.com'
          }
        }
      );

      // Log the raw response
      logger.info('Raw AI response received:', response.data);
      
      // Extract and log just the response content
      const responseContent = response.data.choices[0].message.content;
      logger.info('Response content:', responseContent);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseContent);
        logger.info('Parsed AI response:', parsedResponse);
      } catch (parseError) {
        logger.error('Failed to parse AI response:', responseContent);
        throw new Error('Invalid response from AI service');
      }

      // Check for field name mismatches
      const result = {
        // Try different possible field names the AI might use
        suggestedCategoryId: parsedResponse.categoryId || 
                             parsedResponse.suggestedCategoryId || 
                             parsedResponse.category_id || null,
        
        suggestedAgencyId: parsedResponse.agencyId || 
                           parsedResponse.suggestedAgencyId || 
                           parsedResponse.agency_id || null,
                           
        confidence: parsedResponse.confidence || 0,
        sentimentScore: parsedResponse.sentimentScore || 
                        parsedResponse.sentiment_score || 
                        parsedResponse.sentiment || 0,
                        
        language: parsedResponse.language || 'en'
      };
      
      // Log the final result
      logger.info('Final AI analysis result:', result);
      
      return result;
    } catch (error) {
      logger.error('AI analysis error:', error);
      if (error.response) {
        logger.error('OpenRouter API error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      // Return default values in case of error
      return {
        suggestedCategoryId: null,
        suggestedAgencyId: null,
        confidence: 0,
        sentimentScore: 0,
        language: 'en'
      };
    }
  }
}