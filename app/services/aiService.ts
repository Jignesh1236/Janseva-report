import { Message } from '../types/chat';

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export async function getAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch('/api/shapes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    return 'I apologize, but I encountered an error while processing your request. Please try again.';
  }
} 