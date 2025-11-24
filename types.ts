export type MessageSender = 'user' | 'bot';

export interface MessageProps {
  text: string;
  sender: MessageSender;
  timestamp: Date;
}
