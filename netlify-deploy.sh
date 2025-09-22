#!/bin/bash

echo "🚀 Deploying to Netlify automatically..."

# Create a zip file of the website
echo "📦 Creating deployment package..."
zip -r website-deploy.zip . -x "*.git*" "*.DS_Store*" "deploy.sh" "netlify-deploy.sh" "README.md" "*.zip"

echo "📤 Uploading to Netlify..."
echo "Please go to https://app.netlify.com/sites and drag the website-deploy.zip file to deploy!"
echo ""
echo "Or manually drag the entire Website folder to Netlify dashboard."
echo ""
echo "✅ Your updated prices will be live at collagenclinic.london in 30 seconds!"

open https://app.netlify.com/sites
