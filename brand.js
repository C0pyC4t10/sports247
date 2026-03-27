// SPORTS247 Brand Constants
// This file contains all brand-related constants for consistent usage across the application

const BRAND = {
  name: 'SPORTS247',
  tagline: 'Your 24/7 Sports Intelligence',
  
  colors: {
    primary: {
      green: '#00ff88',
      blue: '#58a6ff', 
      red: '#ff4444'
    },
    categories: {
      cricket: '#e74c3c',
      football: '#27ae60',
      basketball: '#f39c12',
      tennis: '#3498db',
      general: '#9b59b6'
    },
    neutrals: {
      bgDark: '#0d1117',
      bgMedium: '#161b22',
      bgLight: '#1a1a2e',
      textPrimary: '#ffffff',
      textSecondary: '#c9d1d9',
      textMuted: '#8b949e'
    }
  },
  
  typography: {
    fontStack: "'Segoe UI', Arial, sans-serif",
    sizes: {
      hero: '36px',
      title: '24px',
      subtitle: '18px',
      body: '15px',
      small: '13px',
      micro: '11px'
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  image: {
    defaultSize: { width: 1024, height: 1024 },
    logoSizePercent: 0.20,
    logoMinSize: 50,
    logoMaxSize: 200,
    textYOffset: -50,
    overlayOpacity: 0.25,
    gradientOpacity: 0.85,
    brandBarOpacity: 0.6,
    accentLineHeight: 3,
    brandBarHeight: 35,
    gradientHeight: 140
  },
  
  // Style presets aligned with brand identity
  stylePresets: {
    cinematic: "cinematic lighting, film grain, depth of field, 35mm film look, professional photography",
    dramatic: "high contrast, bold colors, intense mood, dramatic shadows, dramatic lighting",
    vintage: "retro colors, film texture, nostalgic feel, faded tones, vintage style",
    modern: "clean lines, vibrant colors, minimalist, contemporary, modern aesthetic",
    neon: "vibrant neon colors, cyberpunk, glowing effects, electric, futuristic",
    hdr: "high dynamic range, vivid colors, enhanced details, sharp, ultra detailed",
    realistic: "photorealistic, hyper detailed, natural lighting, true to life",
    artistic: "artistic style, creative composition, unique perspective, expressive",
    watercolor: "soft watercolor painting, delicate brush strokes, transparent layers, artistic, gentle colors",
    "pixel-art": "pixel art style, 8-bit, retro video game, blocky, limited color palette"
  },

  // Title bar background colors
  titleBarColors: {
    green: '#00ff88',
    blue: '#58a6ff',
    orange: '#ff8800',
    violet: '#8855ff',
    red: '#ff4444',
    dark: '#1a1a2e'
  },

  // Title bar text colors
  titleBarTextColors: {
    white: '#ffffff',
    green: '#00ff88',
    blue: '#58a6ff',
    black: '#000000',
    yellow: '#ffff00',
    orange: '#ff8800'
  },
  
  // Category detection patterns
  categoryPatterns: {
    cricket: /\b(cricket|ipl|test match|wicket|batting|bowling|boundary|t20|odi)\b/i,
    football: /\b(football|soccer|goal|striker|premier league|champions league|la liga)\b/i,
    basketball: /\b(basketball|dunk|nba|three-pointer|arena|hoop)\b/i,
    tennis: /\b(tennis|ace|serve|grand slam|wimbledon|atp|wta)\b/i
  },
  
  // Default enhancement when no category detected
  defaultEnhancement: "professional sports photography, dynamic action, high quality, athletic performance",
  
  // Quality modifiers always added
  qualityModifiers: "professional, 4k, ultra detailed, sharp focus, masterpiece, best quality",
  
  // Negative prompts for AI generation
  negativePrompts: [
    "blurry, low quality, deformed",
    "ugly, bad anatomy, disfigured",
    "watermark, text artifacts, signature",
    "extra limbs, mutated hands, poorly drawn face",
    "out of frame, cropped, cut off"
  ],
  
  // Trending modifiers for artistic appeal
  trendingModifiers: [
    "trending on artstation",
    "award winning",
    "cinematic composition",
    "dramatic lighting",
    "ultra realistic",
    "hyper detailed",
    "octane render",
    "unreal engine 5",
    "vivid colors",
    "sharp focus"
  ],
  
  // Brand-aware prompt template
  promptTemplate: (content, style = 'cinematic', categoryEnhancement = '') => {
    let prompt = content;
    
    // Add category enhancement if provided
    if (categoryEnhancement) {
      prompt += `, ${categoryEnhancement}`;
    }
    
    // Add style preset
    prompt += `, ${BRAND.stylePresets[style] || BRAND.stylePresets.cinematic}`;
    
    // Add quality modifiers
    prompt += `, ${BRAND.qualityModifiers}`;
    
    // Add random trending modifier
    const randomTrend = BRAND.trendingModifiers[Math.floor(Math.random() * BRAND.trendingModifiers.length)];
    prompt += `, ${randomTrend}`;
    
    // Add brand logo instruction for AI generation
    if (content.toLowerCase().includes('generate') || content.toLowerCase().includes('create')) {
      prompt += `, naturally incorporate SPORTS247 brand logo - red running figure icon with red/white 'SPORTS247' text as clean watermark in top-right corner OR integrate naturally into scene (on jersey sleeve, stadium LED screen, arena backdrop, jersey number, corner badge)`;
    }
    
    return prompt;
  },
  
  // Function to detect category from text
  detectCategory: (text) => {
    const textLower = text.toLowerCase();
    
    for (const [category, pattern] of Object.entries(BRAND.categoryPatterns)) {
      if (pattern.test(textLower)) {
        return category;
      }
    }
    
    return 'general';
  },
  
  // Get category enhancement text
  getCategoryEnhancement: (category) => {
    const enhancements = {
      cricket: "cricket stadium, pitch visible, floodlights, dynamic action, professional sports photography",
      football: "dramatic lighting, celebration moment, crowd cheering, confetti, action shot",
      basketball: "indoor arena, court lines visible, dynamic movement, sweat droplets, arena lights",
      tennis: "tennis court, net visible, athletic pose, outdoor lighting, professional tournament",
      general: "professional sports photography, dynamic action, high quality, athletic performance"
    };
    
    return enhancements[category] || enhancements.general;
  }
};

// Export for use in other modules (CommonJS)
module.exports = BRAND;

// Also export individual sections for convenience
module.exports.colors = BRAND.colors;
module.exports.typography = BRAND.typography;
module.exports.image = BRAND.image;
module.exports.stylePresets = BRAND.stylePresets;
module.exports.titleBarColors = BRAND.titleBarColors;
module.exports.titleBarTextColors = BRAND.titleBarTextColors;
module.exports.detectCategory = BRAND.detectCategory;
module.exports.getCategoryEnhancement = BRAND.getCategoryEnhancement;
module.exports.promptTemplate = BRAND.promptTemplate;