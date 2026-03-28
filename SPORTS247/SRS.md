# Software Requirements Specification (SRS)
## Sports247 - Sports News Aggregator & AI Content Generator

---

## 1. Introduction

### 1.1 Purpose
This document provides a comprehensive specification for Sports247, a web-based sports news aggregation platform with AI-powered content generation capabilities.

### 1.2 Scope
Sports247 aggregates sports news from multiple RSS sources, categorizes content by sport, and provides AI tools for analyzing articles and generating branded visual content for social media.

### 1.3 Definitions, Acronyms, and Abbreviations
- **RSS**: Really Simple Syndication (web feed format)
- **API**: Application Programming Interface
- **AI**: Artificial Intelligence
- **SRS**: Software Requirements Specification
- **UI**: User Interface

### 1.4 References
- Express.js Documentation
- OpenRouter API Documentation
- Hugging Face Inference API Documentation
- Cheerio.js Documentation

---

## 2. Overall Description

### 2.1 Product Perspective
Sports247 is a Node.js-based web application that serves as both a news aggregator and a content creation tool. It integrates multiple external APIs to provide a seamless sports news and social media content generation experience.

### 2.2 Product Functions

#### Core Features
1. **News Aggregation**
   - Fetch sports news from multiple RSS feed sources
   - Support for Cricket, Football, Basketball, and Tennis categories
   - Automatic content deduplication
   - Category-based filtering and sorting

2. **AI Content Analysis**
   - Analyze sports articles using AI models via OpenRouter
   - Extract key insights and generate summaries
   - Support for both text input and URL-based scraping

3. **Image Generation**
   - Generate AI-powered images from text prompts
   - Support for multiple size presets (Instagram, Facebook, YouTube)
   - Style presets (cinematic, artistic, documentary, etc.)
   - Logo overlay with customizable positioning

4. **Social Media Post Generation**
   - Generate multiple post variations (Emotional, Controversial, Informative, Aura)
   - Auto-generate hashtags and captions
   - Brand-consistent formatting

### 2.3 User Classes and Characteristics
- **Content Creators**: Generate social media posts from sports news
- **Sports Enthusiasts**: Browse aggregated sports news by category
- **Social Media Managers**: Create branded visual content

### 2.4 Operating Environment
- **Platform**: Node.js (Express.js)
- **Port**: 3000 (default)
- **Dependencies**: Express, Axios, Cheerio, RSS-Parser, Sharp, OpenAI SDK

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 News Aggregation System

**REQ-001**: The system shall fetch news from the following RSS sources:
- ESPN Cricinfo (Cricket)
- Cricket Addictor
- CricTracker
- Sky Sports Cricket
- Cricket Next
- Yahoo Soccer
- 101 Great Goals
- BBC Football
- Sky Sports Football
- Yahoo Sports

**REQ-002**: The system shall categorize news into:
- Cricket (🏏)
- Football (⚽)
- Basketball (🏀)
- Tennis (🎾)
- General (🏆)

**REQ-003**: The system shall detect categories using keyword pattern matching with weighted scoring.

**REQ-004**: The system shall remove duplicate news items using title normalization.

**REQ-005**: The system shall sort news by publication date (newest first).

**REQ-006**: The system shall limit results to 25 items per request.

#### 3.1.2 AI Analysis System

**REQ-010**: The system shall analyze text content via OpenRouter API using GPT-3.5 Turbo model.

**REQ-011**: The system shall accept input as either plain text or URL.

**REQ-012**: If URL is provided, the system shall scrape article content before analysis.

**REQ-013**: The system shall return analysis in 2-3 punchy English sentences with bullet points and emojis.

**REQ-014**: The system shall support the following websites for scraping:
- bbc.com
- skysports.com
- cricbuzz.com
- goal.com
- espn.com
- sportskeeda.com
- icc-cricket.com
- fifa.com
- google.com
- foxsports.com
- bleacherreport.com

#### 3.1.3 Image Generation System

**REQ-020**: The system shall generate images using Hugging Face Stable Diffusion API.

**REQ-021**: The system shall support the following size presets:
- Instagram Post: 1080×1080
- Instagram Story: 1080×1920
- Facebook Post: 1200×630
- Facebook Cover: 820×312
- YouTube Thumbnail: 1280×720
- Custom Size: 1024×1024 (default)

**REQ-022**: The system shall support the following style presets:
- Cinematic
- Artistic
- Documentary
- Minimalist
- Dynamic

**REQ-022a**: The system shall support the following title bar background colors:
- Green (#00ff88)
- Blue (#58a6ff)
- Orange (#ff8800)
- Violet (#8855ff)
- Red (#ff4444)
- Dark (#1a1a2e)

**REQ-022b**: The system shall support the following title bar text colors:
- White (#ffffff)
- Green (#00ff88)
- Blue (#58a6ff)
- Black (#000000)
- Yellow (#ffff00)
- Orange (#ff8800)
- Custom hex color

**REQ-023**: The system shall incorporate SPORTS247 branding in generated images.

**REQ-024**: The system shall add title text overlay with gradient background.

**REQ-025**: The system shall add brand bar with date stamp.

**REQ-026**: The system shall support logo overlay with configurable positioning (top-left, top-right, bottom-left, bottom-right).

**REQ-027**: The system shall provide prompt enhancement using AI (optional).

**REQ-028**: The system shall generate 3 variations when variations are enabled.

#### 3.1.4 Social Media Post Generation

**REQ-030**: The system shall generate exactly 4 post types:
- Emotional: Engaging, reaction-focused caption
- Controversial: Debate-inducing caption
- Informative: News-focused caption
- Aura: Professional comprehensive caption with statistics

**REQ-031**: Each post shall include:
- fbCaption: Social media caption
- hashtags: Array of relevant hashtags (4-5)
- imagePrompt: Description for image generation

**REQ-032**: The system shall naturally integrate SPORTS247 branding in image prompts.

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

**PERF-001**: RSS feed fetching shall timeout after 8 seconds per source.

**PERF-002**: Article scraping shall timeout after 10 seconds.

**PERF-003**: Image generation shall timeout after 120 seconds.

**PERF-004**: The system shall process all RSS sources concurrently.

#### 3.2.2 Reliability

**REL-001**: The system shall handle RSS feed failures gracefully by returning empty results for that source.

**REL-002**: The system shall fall back to Lorem Picsum if AI image generation fails.

**REL-003**: The system shall provide fallback posts if JSON parsing fails.

#### 3.2.3 Security

**SEC-001**: API keys shall be stored in environment variables (.env file).

**SEC-002**: The system shall use CORS to control API access.

**SEC-003**: Request body size shall be limited to 50MB.

#### 3.2.4 Maintainability

**MAIN-001**: RSS sources shall be easily configurable in the NEWS_SOURCES array.

**MAIN-002**: Category patterns shall be modular and extensible.

**MAIN-003**: Style presets shall be defined in the BRAND module.

### 3.3 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/trending` | GET | Get aggregated news by category |
| `/fetch-url` | POST | Scrape article content from URL |
| `/analyze` | POST | Analyze text/URL with AI |
| `/generate-fb-visual` | POST | Generate social media posts |
| `/generate-visual` | POST | Generate AI images |
| `/style-presets` | GET | Get available style presets |
| `/titlebar-colors` | GET | Get available title bar background colors |
| `/size-presets` | GET | Get available size presets |

### 3.4 Data Flow

1. **News Flow**: RSS Sources → RSS Parser → Category Detection → Deduplication → Response
2. **Analysis Flow**: User Input → URL Scraping (optional) → OpenRouter API → Summary
3. **Image Generation Flow**: User Input → Prompt Enhancement → Hugging Face API → Image Processing (Sharp) → Branded Output

### 3.5 Error Handling

- RSS fetch failures: Log error, continue with other sources
- Scraping failures: Return error message to user
- AI API failures: Use fallback content
- Image generation failures: Fall back to placeholder images

---

## 4. Appendix

### 4.1 Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **HTTP Client**: Axios 1.13.6
- **HTML Parser**: Cheerio 1.2.0
- **RSS Parser**: RSS-Parser 3.13.0
- **Image Processing**: Sharp 0.34.5
- **Environment**: dotenv 17.3.1

### 4.2 External APIs
- OpenRouter (AI Analysis & Prompt Enhancement)
- Hugging Face (Image Generation)

### 4.3 Brand Configuration
All brand-specific settings (colors, typography, style presets) are managed in the `brand/brand.js` module.