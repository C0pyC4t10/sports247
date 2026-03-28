# GitHub Upload Script
# Run this in your terminal to upload files to GitHub

# Upload server.js (fixed version)
echo "Uploading server.js..."
curl -X PUT "https://api.github.com/repos/C0pyC4T10/sports247/contents/server.js" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Update server.js with correct paths",
    "content": "REPLACE_WITH_BASE64_CONTENT",
    "sha": "15fa3d1c094a52d23c0166c689179510d9352fb3"
  }'

# To get the base64 content, run this:
# base64 -w0 server.js
