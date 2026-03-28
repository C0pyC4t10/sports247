# Git & GitHub Setup Guide

---

## If Using WINDOWS

### Step 1: Download & Install Git
1. Go to: https://git-scm.com/download/win
2. Click the first link (64-bit)
3. Run the downloaded file
4. Click **Next** through all screens (defaults are fine)
5. Click **Install**

### Step 2: Open Git Bash
After installation, search for **"Git Bash"** in Start menu and open it

### Step 3: Configure Git
Run these commands in Git Bash:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 4: Create GitHub Account (If Needed)
1. Go to: https://github.com
2. Click **"Sign up"**
3. Enter your email, password, username
4. Verify your email

### Step 5: Push Code to GitHub
```bash
cd /home/skarbolt/Documents/C0PYC4T10
git init
git add .
git commit -m "Sports247"
git remote add origin https://github.com/YOUR_USERNAME/sports247.git
git push -u origin main
```

---

## If Using MAC

### Step 1: Install Git
Open **Terminal** and run:
```bash
xcode-select --install
```
Click **Install** when prompted

### Step 2: Create GitHub Account
Go to https://github.com and sign up

### Step 3: Push Code
```bash
cd /home/skarbolt/Documents/C0PYC4T10
git init
git add .
git commit -m "Sports247"
git remote add origin https://github.com/YOUR_USERNAME/sports247.git
git push -u origin main
```

---

## If GitHub Push Asks for Password

### Option 1: Use Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: "Sports247 Deploy"
4. Check: **repo** (full control)
5. Click **"Generate token"**
6. Copy the token (shown once!)
7. When pushing, use the token as password

### Option 2: Use GitHub CLI
```bash
# Install
brew install gh   (Mac)
winget install gh (Windows)

# Login
gh auth login

# Then push
git push -u origin main
```

---

## Need Help?

Share what error message you see and I'll assist!
