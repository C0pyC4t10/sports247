# SPORTS247 - Restore Instructions

## To restore the app after backup:

1. Download from Google Drive
2. Unzip the file
3. Open terminal in the SPORTS247 folder
4. Run `npm install`
5. Add your `.env` file with API keys
6. Run `node server.js`

## Required Environment Variables (.env)

Create a `.env` file in the SPORTS247 folder with:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Access the App

After starting the server, open your browser and go to:
`http://localhost:3000`