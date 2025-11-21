import { Message } from "@/types/chat";

export const getChatResponse = async (
  currentMessage: string,
  history: Message[]
): Promise<string> => {
  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentMessage, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong with the chatbot API.');
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Error fetching response from chatbot API:", error);
    return error.message || "I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
