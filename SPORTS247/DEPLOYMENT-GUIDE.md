# Sports247 Telegram Bot - Deployment Guide

## Current Status
✅ Code is ready
⏳ Need your action on Render.com

---

## What You Need To Do NOW:

### Step 1: Add Environment Variables on Render.com

1. Go to **render.com** → Your dashboard
2. Click on **`sports247-bot`** service
3. Click **"Environment"** on the left sidebar
4. Click **"Add Environment Variable"** TWO times:

**Variable 1:**
- Key: `TELEGRAM_BOT_TOKEN`
- Value: `8731020857:AAHX7HpMsuxoXmxUR4T5LYNQX0lg-nmpC1g`

**Variable 2:**
- Key: `OPENROUTER_API_KEY`
- Value: `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`

5. Click **"Save Changes"**
6. Wait for redeploy (1-2 minutes)

---

### Step 2: Get Your Render URL

After redeploy, copy your Render URL from the dashboard:
- It looks like: `https://sports247-bot.onrender.com`

---

### Step 3: Set Webhook

Once you have your Render URL, visit this link in your browser:

```
https://api.telegram.org/bot8731020857:AAHX7HpMsuxoXmxUR4T5LYNQX0lg-nmpC1g/setWebhook?url=https://YOUR-RENDER-URL.onrender.com/telegraf
```

(Replace `YOUR-RENDER-URL` with your actual URL)

---

### Step 4: Test Bot

Open Telegram and message **@C0PYC4T10BOT** with:
- `/start` - Should show menu!
- `Hello` - AI should reply!

---

## Need HELP?
If webhook setup fails, just tell me your Render URL and I'll help you set it up!
