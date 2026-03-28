# VikingVision - AI Viking Video Generator

AI-powered web application for generating videos about Viking lifestyles, culture, history, and mythology.

## Features

- 🔮 AI Video Generation from text prompts
- 🏔️ Theme selection (Mountains, Snows, Forest, Ocean, etc.)
- 🗺️ Region selection (Norway, Denmark, Iceland, etc.)
- 👤 User authentication & profiles
- 🎬 Video gallery with filtering
- 💾 Credit system for video generation

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Installation

```bash
# Clone and navigate to project
cd vikingvision

# Install dependencies
npm install
cd client && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
```

## Running

```bash
# Development (both frontend & backend)
npm run dev

# Or separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vikingvision
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
HIGGSFIELD_API_KEY=your_key
WAN_API_KEY=your_key
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/videos/generate | Generate video |
| GET | /api/videos | Get videos |
| GET | /api/videos/themes | Get themes |
| GET | /api/videos/regions | Get regions |

## Themes

Mountains, Snows, Wild, Forest, Life, Culture, Ocean, Rivers, Kingdoms, Native, Countries

## Regions

Norway, Denmark, Sweden, Iceland, Greenland, England, France, Russia, Italy, Ireland, Scotland