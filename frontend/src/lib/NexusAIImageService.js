/**
 * NexusAIImageService — High-Precision Dynamic AI Image Generation Engine
 * Generates prompt-accurate, high-definition AI images using Pollinations AI Flux engine.
 */

const STYLE_MODIFIERS = {
  'photorealistic': 'photorealistic, hyperrealistic, 8K resolution, detailed texture, DSLR, sharp focus, studio lighting',
  'digital-art': 'digital art, concept art, trending on ArtStation, Unreal Engine 5 render, cinematic lighting, 8K',
  'anime': 'anime style, Studio Ghibli, Makoto Shinkai, highly detailed, vibrant colors, masterpiece, 4K',
  'oil-painting': 'oil painting, textured canvas, heavy impasto brushstrokes, masterpiece, rich colors, classical art',
  'cyberpunk': 'cyberpunk, neon glow, blade runner 2049, volumetric fog, rainy night reflections, futuristic, 8K',
  'fantasy': 'epic fantasy, mythical, dramatic lighting, detailed magic runes, cinematic, masterpiece',
  'sketch': 'pencil sketch, detailed line art, hatching, high contrast, graphite drawing, masterpiece',
  'watercolor': 'watercolor painting, soft color bleeding, delicate washes, artistic, aesthetic, masterpiece',
  '3d-render': '3D render, Blender, Octane render, raytracing, physically based rendering, 8K UHD',
  'pixel-art': 'pixel art, 32-bit, retro game sprite, crisp pixels, isometric, vibrant color palette',
};

const STYLE_FALLBACKS = {
  'photorealistic': [
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1024&auto=format&fit=crop&q=80',
  ],
  'cyberpunk': [
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1024&auto=format&fit=crop&q=80',
  ],
  'digital-art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1024&auto=format&fit=crop&q=80',
  ],
  'anime': [
    'https://images.unsplash.com/photo-1528164344705-47542687990d?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1024&auto=format&fit=crop&q=80',
  ],
  'fantasy': [
    'https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=1024&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1024&auto=format&fit=crop&q=80',
  ]
};

/**
 * Generate a dynamic, prompt-accurate AI image URL using Pollinations AI Flux engine.
 */
export function getAccurateAIImageUrl(prompt, style = 'photorealistic', seed = 0, width = 1024, height = 1024) {
  if (!prompt || typeof prompt !== 'string') {
    prompt = 'Futuristic AI neural network consciousness explosion of light and data';
  }

  const modifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['photorealistic'];
  const fullPrompt = `${prompt.trim()}, ${modifier}`;
  const cleanPrompt = encodeURIComponent(fullPrompt);
  
  const seedNum = (typeof seed === 'number' ? seed : 42) + Math.floor(Math.random() * 9999);
  
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seedNum}&model=flux&nologo=true&enhance=true`;
}

/**
 * Secondary fallback if Pollinations AI fails or times out.
 */
export function getFallbackAIImageUrl(prompt, style = 'digital-art', idx = 0) {
  const seedNum = Math.abs(hashString(prompt || 'ai')) + idx * 777;
  const list = STYLE_FALLBACKS[style] || STYLE_FALLBACKS['digital-art'];
  const stockUrl = list[idx % list.length];
  
  // Try secondary Pollinations prompt or high-res picsum with seed
  return `https://picsum.photos/seed/${seedNum}/1024/1024`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
