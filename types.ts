export interface BotConfig {
  companyName: string;
  assistantName: string;
  tone: 'formal' | 'amigavel' | 'assertivo';
  systemInstruction: string;
  knowledgeBase: string;
  contactPhone: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum ViewState {
  ADMIN = 'admin',
  CHAT = 'chat',
  CONNECT = 'connect'
}