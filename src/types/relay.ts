export interface Relay {
  id: string;
  currentTopic: string;
  remainingSeconds: number;
  status: "WAITING" | "PLAYING" | "COMPLETED";
}

export interface RelayAnalysis {
  isCorrect: boolean;
  similarityScore: number;
  creativityScore: number;
  stretchScore: number;
  nextTopic: string;
}
