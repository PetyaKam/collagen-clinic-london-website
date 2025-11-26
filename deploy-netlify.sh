#!/bin/bash

# Netlify API Deployment Script
# Usage: ./deploy-netlify.sh [NETLIFY_AUTH_TOKEN] [NETLIFY_SITE_ID]

set -e

NETLIFY_AUTH_TOKEN="${1:-$NETLIFY_AUTH_TOKEN}"
NETLIFY_SITE_ID="${2:-$NETLIFY_SITE_ID}"

if [ -z "$NETLIFY_AUTH_TOKEN" ] || [ -z "$NETLIFY_SITE_ID" ]; then
    echo "❌ Error: Missing required parameters"
    echo ""
    echo "Usage:"
    echo "  ./deploy-netlify.sh [NETLIFY_AUTH_TOKEN] [NETLIFY_SITE_ID]"
    echo ""
    echo "Or set environment variables:"
    echo "  export NETLIFY_AUTH_TOKEN=your_token"
    echo "  export NETLIFY_SITE_ID=your_site_id"
    exit 1
fi

echo "🚀 Deploying to Netlify..."
echo "📍 Site ID: $NETLIFY_SITE_ID"
echo ""

# Create a zip file of the website (excluding unnecessary files)
echo "📦 Creating deployment package..."
zip -r /tmp/netlify-deploy.zip . \
    -x "*.git*" \
    -x "*.DS_Store*" \
    -x "deploy.sh" \
    -x "netlify-deploy.sh" \
    -x "deploy-netlify.sh" \
    -x "README.md" \
    -x "*.md" \
    -x "*.zip" \
    -x "*.pdf" \
    -x ".github/*" \
    > /dev/null 2>&1

echo "📤 Uploading to Netlify..."

# Deploy using Netlify API
RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    -H "Content-Type: application/zip" \
    --data-binary @/tmp/netlify-deploy.zip \
    "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys")

# Check if deployment was successful
if echo "$RESPONSE" | grep -q '"state":"uploading"\|"state":"ready"\|"id"'; then
    DEPLOY_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "✅ Deployment initiated successfully!"
    echo "🔗 Deploy ID: $DEPLOY_ID"
    echo "🌐 Your site will be live at: https://collagenclinic.london/"
    echo ""
    echo "⏱️  Deployment typically takes 30-60 seconds"
    echo "📊 Check status: https://app.netlify.com/sites/$NETLIFY_SITE_ID/deploys/$DEPLOY_ID"
else
    echo "❌ Deployment failed"
    echo "Response: $RESPONSE"
    exit 1
fi

# Cleanup
rm -f /tmp/netlify-deploy.zip

echo ""
echo "✨ Deployment complete!"

