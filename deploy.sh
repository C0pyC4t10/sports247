#!/bin/bash

# Sports247 Deployment Script

echo "Initializing git..."
git init
git add .
git commit -m "Sports247 web app"

echo ""
echo "Now go to GitHub.com and create a new repository called 'sports247'"
echo "Then run these commands (replace YOUR_USERNAME with your GitHub username):"
echo ""
echo "git remote add origin https://github.com/YOUR_USERNAME/sports247.git"
echo "git push -u origin main"
echo ""
echo "After pushing to GitHub:"
echo "1. Go to render.com"
echo "2. Create new Web Service"
echo "3. Connect your GitHub"
echo "4. Select 'sports247' repository"
echo "5. Use these settings:"
echo "   - Name: sports247"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
