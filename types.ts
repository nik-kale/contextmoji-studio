
export enum Platform {
  X = 'X (Twitter)',
  LINKEDIN = 'LinkedIn',
  THREADS = 'Threads',
  BLUE_SKY = 'BlueSky',
  FACEBOOK = 'Facebook',
  BRUT_SOCIAL = 'Brut Social'
}

export enum TextDensity {
  CONCISE = 'Concise',
  BALANCED = 'Balanced',
  DETAILED = 'Detailed'
}

export enum ImageStyle {
  PROFESSIONAL = 'Professional',
  ABSTRACT = 'Abstract',
  REALISTIC = 'Realistic',
  INFOGRAPHIC = 'Infographic'
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  WIDE = '4:3'
}

export enum ColorPalette {
  CORPORATE = 'Corporate Blue & Gray',
  VIBRANT = 'Vibrant & Energetic',
  MINIMAL = 'Minimalist Monochrome',
  EARTHY = 'Natural & Earthy',
  CYBERPUNK = 'Neon & Cyberpunk',
  CUSTOM = 'Custom Hex'
}

export interface BrandProfile {
  name: string;
  hexColor: string;
  tone: string;
  isBrandModeActive: boolean;
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

export interface UserCredits {
  remaining: number;
  total: number;
  isPro: boolean;
  hasCustomKey: boolean;
}
