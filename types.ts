
export enum Platform {
  X = 'X (Twitter)',
  LINKEDIN = 'LinkedIn',
  THREADS = 'Threads',
  BLUE_SKY = 'Blue Sky',
  SLACK = 'Slack',
  CASUAL = 'Casual'
}

export interface GeminiResponse {
  originalWithEmoji: string;
  variations: {
    text: string;
    explanation: string;
  }[];
  platformAdvice: string;
  emojiCountUsed: number;
}
