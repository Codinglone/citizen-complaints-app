import { Complaint } from '../entities/Complaint';
import { Agency } from '../entities/Agency';
import { Category } from '../entities/Category';
import { getRepository } from 'typeorm';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIRoutingService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  }

  async routeComplaint(complaint: Complaint): Promise<Agency | null> {
    try {
      // Get all available agencies
      const agencyRepository = getRepository(Agency);
      const agencies = await agencyRepository.find();

      if (agencies.length === 0) {
        return null;
      }

      // Prepare the prompt for the AI
      const prompt = this.buildRoutingPrompt(complaint, agencies);

      // Get AI recommendation
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'Citizen Complaints App'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus-20240229',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps route citizen complaints to the most appropriate government agency. Consider the complaint\'s category, description, and location to make the best match.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendation');
      }

      const data = await response.json() as OpenRouterResponse;
      const recommendedAgencyId = data.choices[0].message.content?.trim();
      
      if (!recommendedAgencyId) {
        return null;
      }

      // Find the recommended agency
      const recommendedAgency = agencies.find(agency => agency.id === recommendedAgencyId);
      return recommendedAgency || null;

    } catch (error) {
      console.error('Error in AI routing:', error);
      return null;
    }
  }

  private buildRoutingPrompt(complaint: Complaint, agencies: Agency[]): string {
    const agencyList = agencies.map(agency => 
      `ID: ${agency.id}, Name: ${agency.name}, Description: ${agency.description}`
    ).join('\n');

    return `
      Please analyze this complaint and recommend the most appropriate agency to handle it.
      
      Complaint Details:
      Title: ${complaint.title}
      Description: ${complaint.description}
      Category: ${complaint.category.name}
      Location: ${complaint.location || 'Not specified'}
      
      Available Agencies:
      ${agencyList}
      
      Please respond with ONLY the ID of the most appropriate agency. If no agency is suitable, respond with "NONE".
    `;
  }

  async updateRoutingModel(complaint: Complaint, agency: Agency, wasSuccessful: boolean): Promise<void> {
    // This method can be used to fine-tune the routing model based on feedback
    // Implementation would depend on the specific AI model and training approach
    console.log('Updating routing model with feedback:', {
      complaintId: complaint.id,
      agencyId: agency.id,
      wasSuccessful
    });
  }
} 