#!/bin/bash
# Quick deployment script for Travel Split app

echo "🏗️  Building app for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "🚀 Deploying to Firebase..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo "🌐 Your app is live at: https://travel-split-78317.web.app"
    else
        echo "❌ Deployment failed!"
    fi
else
    echo "❌ Build failed!"
fi
