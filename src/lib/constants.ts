// Constants para o AI Studio

export const CREDIT_COSTS = {
  image: 1,
  video: 5,
  upscale: 2,
  variation: 1,
  removeBg: 1,
} as const;

export const IMAGE_MODELS = [
  { value: 'default', label: 'Padrão' },
  { value: 'realistic', label: 'Realista' },
  { value: 'anime', label: 'Anime' },
  { value: '3d', label: '3D' },
  { value: 'artistic', label: 'Artístico' },
] as const;

export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Quadrado)' },
  { value: '9:16', label: '9:16 (Vertical)' },
  { value: '16:9', label: '16:9 (Horizontal)' },
  { value: '4:5', label: '4:5 (Retrato)' },
] as const;

export const VIDEO_DURATIONS = [
  { value: '3s', label: '3 segundos' },
  { value: '5s', label: '5 segundos' },
  { value: '10s', label: '10 segundos' },
  { value: '15s', label: '15 segundos' },
] as const;

export const VIDEO_STYLES = [
  { value: 'realistic', label: 'Realista' },
  { value: 'anime', label: 'Anime' },
  { value: 'cinematic', label: 'Cinemático' },
  { value: '3d', label: '3D' },
  { value: 'fantasy', label: 'Fantasia' },
] as const;

export const PLANS = {
  free: {
    name: 'Grátis',
    credits: 10,
    price: 0,
    features: [
      '10 créditos por mês',
      'Geração de imagens',
      'Geração de vídeos básicos',
      'Qualidade padrão',
    ],
  },
  pro: {
    name: 'Pro',
    credits: 500,
    price: 29.90,
    features: [
      '500 créditos por mês',
      'Geração ilimitada',
      'Qualidade máxima',
      'Upscale 4K',
      'Suporte prioritário',
      'Sem marca d\'água',
    ],
  },
} as const;
