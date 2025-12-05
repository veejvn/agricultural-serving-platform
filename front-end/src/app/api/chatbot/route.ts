import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Sender } from "@/types/chat";
import { NextResponse } from "next/server";

// Initialize the Gemini API client
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_INSTRUCTION = `You are AgriBot, an expert agricultural assistant. 
Your goal is to help farmers and gardening enthusiasts with advice on produce, fertilizers, pesticides, farming equipment (specifically John Deere and similar brands), and general crop care.
Keep your responses helpful, concise, and encouraging. 
If asked about something unrelated to agriculture, politely steer the conversation back to farming topics.
Use formatting like bullet points for lists of recommendations.`;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Error: API Key is missing. Please check your configuration.",
        },
        { status: 500 }
      );
    }

    const { currentMessage, history } = await req.json();

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Lọc lịch sử để đảm bảo tin nhắn đầu tiên là của người dùng
    const filteredHistory = history
      .slice(0, -1)
      .filter((msg: Message, index: number, arr: Message[]) => {
        // Nếu đây là tin nhắn đầu tiên và nó là của bot, loại bỏ nó
        if (index === 0 && msg.role === Sender.Bot) {
          return false;
        }
        // Nếu có tin nhắn của bot ở đầu, loại bỏ cho đến khi gặp tin nhắn của user
        if (
          arr.slice(0, index).every((prevMsg) => prevMsg.role === Sender.Bot) &&
          msg.role === Sender.Bot
        ) {
          return false;
        }
        return true;
      });

    const chatSession = model.startChat({
      history: filteredHistory.map((msg: Message) => ({
        role: msg.role === Sender.User ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chatSession.sendMessage(currentMessage);
    const response = await result.response;
    return NextResponse.json({ response: response.text() });
  } catch (error: any) {
    console.error("Error fetching response from Gemini:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "I'm having trouble connecting to my knowledge base right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}
