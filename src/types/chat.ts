export interface ChatMessage {
  id: number;
  roomId: number | null;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
}
