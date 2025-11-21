export enum Sender {
  User = "user",
  Bot = "model",
}

export interface Message {
  id: string;
  role: Sender;
  text: string;
  timestamp: number;
}

export interface ChatState {
  isOpen: boolean;
  isLoading: boolean;
  messages: Message[];
}
