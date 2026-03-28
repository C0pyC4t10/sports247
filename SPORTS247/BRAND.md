# SPORTS247 Brand Guidelines

> "Your 24/7 Sports Intelligence" - A comprehensive guide to maintaining brand consistency across all SPORTS247 platforms and generated content.

## Table of Contents
1. [Brand Identity](#brand-identity)
2. [Visual Style Guide](#visual-style-guide)
3. [Prompt Engineering Guidelines](#prompt-engineering-guidelines)
4. [Reference Image Rules](#reference-image-rules)
5. [Technical Implementation](#technical-implementation)
6. [Examples & Templates](#examples--templates)

---

## Brand Identity

### Brand Name
- **Official Name**: SPORTS247
- **Tagline**: "Your 24/7 Sports Intelligence"
- **Naming Convention**: 
  - Logo/Icon: Always "SPORTS247" (no spaces, all caps)
  - Text references: "SPORTS247" or "Sports 247" (title case)
  - Never use: "Sports AI Bot", "SportsBot", "S247"

### Logo
- **Primary Logo Description**: Red running figure icon with red/white 'SPORTS247' text
- **Minimum Size**: 50px width for digital, 1 inch for print
- **Clear Space**: 20px padding around logo in all directions
- **Placement Rules**:
  - Default: Top-right corner of images
  - Alternative positions: Top-left, bottom-left, bottom-right (based on composition)
  - Never place in center unless specifically designed for it

### Color Palette

#### Primary Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| **SPORTS247 Green** | `#00ff88` | CTAs, highlights, success states, accent lines |
| **SPORTS247 Blue** | `#58a6ff` | Links, secondary actions, tech elements |
| **SPORTS247 Red** | `#ff4444` | Logo, alerts, urgent news, branding accents |

#### Category Colors
| Sport | Hex Code | Usage |
|-------|----------|-------|
| Cricket | `#e74c3c` | Cricket category indicators, badges |
| Football | `#27ae60` | Football category indicators, badges |
| Basketball | `#f39c12` | Basketball category indicators, badges |
| Tennis | `#3498db` | Tennis category indicators, badges |
| General | `#9b59b6` | General sports, multi-sport content |

#### Neutral Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Background Dark | `#0d1117` | Main background |
| Background Medium | `#161b22` | Card backgrounds, containers |
| Background Light | `#1a1a2e` | Secondary backgrounds, gradients |
| Text Primary | `#ffffff` | Main text, headings |
| Text Secondary | `#c9d1d9` | Body text, descriptions |
| Text Muted | `#8b949e` | Secondary text, captions |

### Typography
- **Primary Font Stack**: 'Segoe UI', Arial, sans-serif
- **Font Weights**:
  - Regular (400): Body text, descriptions
  - Medium (500): Brand text, labels, form inputs
  - Semibold (600): Titles, headings, important labels
  - Bold (700): Logo, primary headlines, call-to-action buttons

- **Size Scale** (based on current implementation):
  - Hero Title: 36px
  - Section Title: 24px  
  - Subtitle: 18px
  - Body: 15px
  - Small: 13px
  - Micro: 11px
  - Logo text: 1.6% of image width
  - Title text: 3.2% of image width

### Voice & Tone
- **Brand Voice**: Professional yet approachable, data-driven but engaging, authoritative on sports matters, slightly technical (AI/tech angle)
- **Tone Adaptations**:
  - **Breaking News**: Urgent, concise, factual
  - **Analysis**: Detailed, insightful, balanced  
  - **Social Media**: Engaging, conversational, emoji-friendly
  - **Error Messages**: Helpful, clear, non-technical

- **Writing Style**:
  - Use active voice
  - Keep sentences under 25 words
  - Use sports terminology correctly
  - Include relevant stats when available
  - Avoid jargon unless explaining technical concepts

---

## Visual Style Guide

### Style Presets
Current available styles with brand-aligned descriptions:

| Style | Description | Brand Alignment |
|-------|-------------|-----------------|
| **Cinematic** | Cinematic lighting, film grain, depth of field, 35mm film look | Professional broadcast feel |
| **Dramatic** | High contrast, bold colors, intense mood, dramatic shadows | Breaking news, highlights |
| **Modern** | Clean lines, vibrant colors, minimalist, contemporary | Tech-forward, analytics |
| **Neon** | Vibrant neon colors, cyberpunk, glowing effects, electric | Social media viral, modern |
| **HDR** | High dynamic range, vivid colors, enhanced details, sharp | High-quality photography |
| **Realistic** | Photorealistic, hyper detailed, natural lighting, true to life | News reporting, documentation |
| **Artistic** | Artistic style, creative composition, unique perspective | Feature stories, retrospectives |
| **Watercolor** | Soft watercolor painting, delicate brush strokes, transparent | Creative, artistic content |
| **Pixel-art** | Pixel art style, 8-bit, retro video game, blocky | Nostalgic, retro sports moments |

### Image Composition Rules
1. **Rule of Thirds**: Place key subjects at intersection points
2. **Brand Visibility**: Logo always visible, text always readable
3. **Color Harmony**: Use brand colors for emphasis, category colors for identification
4. **Text Safety Zone**: Keep text in bottom 35% of image with gradient overlay
5. **Logo Safety Zone**: Keep logo in corners with minimum 20px padding

### Color Usage in Images
- **Background Overlay**: 25% black overlay for text readability
- **Text Gradient**: Bottom gradient from transparent to 85% black
- **Accent Line**: Green-to-blue gradient (SPORTS247 Green to SPORTS247 Blue)
- **Brand Bar**: 60% black background for brand text

---

## Prompt Engineering Guidelines

### Brand-Aware Prompt Structure
```
[Original content] + [Brand style] + [Category enhancement] + [Quality modifiers] + [Trending modifiers]
```

### Style Preset Examples
Each style preset adds specific visual characteristics. Choose based on content type:

| Style | Visual Characteristics | Example Prompt Suffix | Best For |
|-------|------------------------|-----------------------|----------|
| **Cinematic** | Cinematic lighting, film grain, depth of field, 35mm film look, professional photography | `cinematic lighting, film grain, depth of field, 35mm film look, professional photography` | Broadcast-quality highlights, feature stories |
| **Dramatic** | High contrast, bold colors, intense mood, dramatic shadows, dramatic lighting | `high contrast, bold colors, intense mood, dramatic shadows, dramatic lighting` | Breaking news, intense moments, rivalries |
| **Vintage** | Retro colors, film texture, nostalgic feel, faded tones, vintage style | `retro colors, film texture, nostalgic feel, faded tones, vintage style` | Historical moments, classic matches, retrospectives |
| **Modern** | Clean lines, vibrant colors, minimalist, contemporary, modern aesthetic | `clean lines, vibrant colors, minimalist, contemporary, modern aesthetic` | Analytics, tech-focused content, clean visuals |
| **Neon** | Vibrant neon colors, cyberpunk, glowing effects, electric, futuristic | `vibrant neon colors, cyberpunk, glowing effects, electric, futuristic` | Social media viral, esports, futuristic concepts |
| **HDR** | High dynamic range, vivid colors, enhanced details, sharp, ultra detailed | `high dynamic range, vivid colors, enhanced details, sharp, ultra detailed` | High-quality photography, vivid scenes |
| **Realistic** | Photorealistic, hyper detailed, natural lighting, true to life | `photorealistic, hyper detailed, natural lighting, true to life` | News reporting, documentation, authentic moments |
| **Artistic** | Artistic style, creative composition, unique perspective, expressive | `artistic style, creative composition, unique perspective, expressive` | Feature stories, creative angles, artistic interpretations |
| **Watercolor** | Soft watercolor painting, delicate brush strokes, transparent layers, artistic, gentle colors | `soft watercolor painting, delicate brush strokes, transparent layers, artistic, gentle colors` | Creative, artistic content, gentle themes |
| **Pixel-art** | Pixel art style, 8-bit, retro video game, blocky, limited color palette | `pixel art style, 8-bit, retro video game, blocky, limited color palette` | Nostalgic content, retro sports moments, gaming crossovers |

### Example Transformations
**Original**: "Virat Kohli scores century in IPL match"
**Enhanced**: "Virat Kohli scores century in IPL match, cricket stadium, pitch visible, floodlights, dynamic action, professional sports photography, cinematic lighting, film grain, depth of field, professional, 4k, ultra detailed, sharp focus, masterpiece, best quality, trending on artstation"

### Category Detection Keywords
Automatically detected and enhanced:
- Cricket: ipl, test match, wicket, batting, bowling
- Football: goal, striker, premier league, champions league  
- Basketball: dunk, nba, three-pointer, arena
- Tennis: ace, serve, grand slam, wimbledon

### Logo Integration in Prompts
For AI-generated images, always include:
```
"naturally incorporate SPORTS247 brand logo - red running figure icon with red/white 'SPORTS247' text as clean watermark in top-right corner OR integrate naturally into scene (on jersey sleeve, stadium LED screen, arena backdrop, jersey number, corner badge)"
```

---

## Reference Image Rules

### When to Use Reference Images
1. **Style Transfer**: Use to match artistic style while maintaining brand consistency
2. **Color Palette Extraction**: Extract dominant colors to influence generated images
3. **Composition Guidance**: Use layout as template for new content
4. **Quality Benchmark**: Ensure generated images meet quality standards

### Reference Image Processing
1. **Color Adjustment**: Apply brand color overlays after using reference
2. **Logo Overlay**: Always add SPORTS247 logo regardless of reference content
3. **Text Addition**: Always add brand bar and title text
4. **Brand Consistency Check**: Verify final output aligns with brand guidelines

### Prohibited Reference Uses
- Don't use references with conflicting brand logos
- Don't use low-quality or inappropriate sports images
- Don't use references that violate copyright
- Don't use references that don't align with sports context

---

## Technical Implementation

### Brand Constants File Structure
```javascript
// Recommended: /brand/brand.js
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
  ]
};

// Export for use in other modules (CommonJS)
module.exports = BRAND;
```

### Validation Rules
1. **Color Contrast**: Text must have 4.5:1 contrast ratio against background
2. **Logo Visibility**: Logo must be clearly visible with background rectangle
3. **Text Readability**: All text must be readable at target resolution
4. **Brand Consistency**: Generated images must include at least one primary brand color

### Code Integration Points
- `enhancePrompt()` function: Add brand color mentions
- `generateSingleImage()`: Use brand constants for sizing and colors
- Social media generation: Ensure brand voice in captions
- Reference image processing: Apply brand overlays consistently

---

## Examples & Templates

### Sample Prompts
1. **Breaking News**: "Lionel Messi scores hat-trick in Champions League final, dramatic lighting, bold colors, intense mood, stadium packed with fans, celebration moment, professional sports photography, cinematic lighting, 4k, ultra detailed, SPORTS247 logo naturally integrated on stadium screen"

2. **Analysis**: "Nadal vs Djokovic rivalry statistics comparison, clean lines, minimalist design, data visualization style, tennis court background, professional, sharp focus, SPORTS247 branding in corner"

3. **Social Media Viral**: "Underdog team wins championship, vibrant neon colors, cyberpunk sports arena, glowing effects, electric atmosphere, crowd cheering, trending on artstation, SPORTS247 logo as jersey badge"

### Before/After Examples
**Before Enhancement**: "Cricket match highlights"
**After Enhancement**: "Cricket match highlights, cricket stadium, pitch visible, floodlights, dynamic action, professional sports photography, cinematic lighting, film grain, depth of field, professional, 4k, ultra detailed, sharp focus, masterpiece, best quality, trending on artstation, SPORTS247 logo naturally integrated"

### Templates
1. **News Template**: [Headline] + [Category color accent] + [Logo placement] + [Brand bar]
2. **Social Media Template**: [Engaging caption] + [Hashtags] + [Eye-catching image] + [Brand watermark]
3. **Analytics Template**: [Data visualization] + [Clean design] + [Brand colors] + [Professional typography]

---

## Maintenance & Updates

### Version History
- v1.0: Initial brand guideline creation

### Update Process
1. Propose changes in team discussion
2. Update this document
3. Implement in code
4. Test across all platforms
5. Document changes in version history

### Contact
For brand guideline questions or updates, contact the SPORTS247 development team.