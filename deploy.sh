#!/bin/bash

# Simple deployment script for Collagen Clinic website
echo "🚀 Deploying Collagen Clinic London website..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Make sure you're in the website directory."
    exit 1
fi

echo "✅ Website files found"
echo "📁 Files ready for deployment:"
ls -la *.html *.css *.js

echo "🌐 Your website is ready to deploy!"
echo ""
echo "To make it live, you can:"
echo "1. Upload these files to any web hosting service"
echo "2. Use GitHub Pages (requires GitHub authentication)"
echo "3. Use Netlify by dragging the folder to netlify.com"
echo ""
echo "✨ All your updated prices are included!"
