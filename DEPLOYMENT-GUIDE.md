# Sports247 Deployment Guide - Step by Step

This guide will help you deploy Sports247 to Render.com.

---

## Prerequisites
- GitHub account
- Render.com account

---

## STEP 1: Install Git (If Not Already)

**Windows:**
1. Download from: https://git-scm.com/download/win
2. Run the installer with default settings

**Mac:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install git
```

---

## STEP 2: Create GitHub Repository

1. Go to: https://github.com
2. Log in to your account
3. Click **"+"** (top right) → **"New repository"**
4. Fill in:
   - Repository name: `sports247`
   - Description: `Sports247 Web Application`
   - **Public** (selected)
5. Click **"Create repository"**
6. **Do NOT add any files** (we'll push our code)

---

## STEP 3: Push Code to GitHub

Open Terminal/Command Prompt and run these commands:

```bash
# Navigate to project folder
cd /home/skarbolt/Documents/C0PYC4T10

# Initialize git
git init

# Add all files
git add .

# Commit files
git commit -m "Sports247 web app"

# Connect to your GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sports247.git

# Push to GitHub
git push -u origin main
```

> **Note:** If you get permission error, you need to generate SSH key or use GitHub CLI.

---

## STEP 4: Deploy on Render

1. Go to: https://render.com
2. Log in to your account
3. Click **"New +"** (top right)
4. Select **"Web Service"**
5. Under "Connect a repository", click **"GitHub"**
6. Authorize GitHub if prompted
7. Select the **`sports247`** repository
8. Configure these settings:

| Setting | Value |
|---------|-------|
| Name | `sports247` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | `Free` |

9. Click **"Create Web Service"**
10. Wait 1-2 minutes for deployment

---

## STEP 5: Get Your Live URL

1. On Render dashboard, click on your **`sports247`** service
2. Look for the **"URL"** field (e.g., `https://sports247.onrender.com`)
3. Copy this URL

---

## STEP 6: Test Your Site

1. Open your Render URL in browser
2. You should see Sports247 website!

---

## Troubleshooting

**Build fails:**
- Check the "Logs" tab on Render
- Make sure package.json has correct dependencies

**Site not loading:**
- Wait 2-3 minutes after deployment
- Check the URL is correct

**Need to update code:**
```bash
git add .
git commit -m "Update"
git push
```
Render will auto-deploy!

---

## Questions?

If you get stuck at any step, share the error message and I'll help!
