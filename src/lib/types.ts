// Types para o AI Studio

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'pro';
  createdAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  type: 'image' | 'video';
  prompt: string;
  negativePrompt?: string;
  model?: string;
  url: string;
  thumbnail?: string;
  settings: Record<string, any>;
  createdAt: Date;
  name?: string;
}

export interface GenerationSettings {
  // Image settings
  model?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:5' | 'custom';
  steps?: number;
  cfgScale?: number;
  
  // Video settings
  duration?: '3s' | '5s' | '10s' | '15s';
  style?: string;
}

export interface CreditCost {
  image: number;
  video: number;
  upscale: number;
  variation: number;
}
