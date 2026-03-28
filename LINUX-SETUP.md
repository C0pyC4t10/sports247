# Git Setup on Linux (Ubuntu/Debian)

---

## Step 1: Install Git

Open Terminal and run:
```bash
sudo apt-get update
sudo apt-get install git
```

Enter your password when prompted.

---

## Step 2: Configure Git
```bash
git config --global user.name "Your GitHub Username"
git config --global user.email "your@email.com"
```

---

## Step 3: Create GitHub Account (If Needed)

1. Go to: https://github.com
2. Click **"Sign up"**
3. Follow the steps

---

## Step 4: Push Code to GitHub

Run these commands:
```bash
cd /home/skarbolt/Documents/C0PYC4T10
git init
git add .
git commit -m "Sports247"
git remote add origin https://github.com/YOUR_USERNAME/sports247.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## If Push Asks for Username/Password

This is normal. Enter:
- **Username:** your GitHub username
- **Password:** Use a **Personal Access Token** instead of your GitHub password

### To Create Token:
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Note: "Sports247"
4. Check: **repo** (first checkbox)
5. Scroll down → Click **"Generate token"**
6. **Copy the token NOW** (it won't show again!)
7. Use this token as your password when pushing
