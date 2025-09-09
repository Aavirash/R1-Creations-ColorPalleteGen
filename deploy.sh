#!/bin/bash

echo "Mood Palette Generator Deployment Script"
echo "======================================"

echo "1. Preparing deployment package..."
# Create deployment folder if it doesn't exist
mkdir -p r1-mood-palette-deploy

# Copy essential files
cp -r plugin-demo/mood-palette/* r1-mood-palette-deploy/

echo "✓ Deployment folder created"

echo "2. Creating ZIP package..."
zip -r r1-mood-palette-deploy.zip r1-mood-palette-deploy > /dev/null

echo "✓ ZIP package created: r1-mood-palette-deploy.zip"

echo ""
echo "Deployment Options:"
echo "==================="
echo "1. GitHub Pages:"
echo "   - Create a GitHub account: https://github.com"
echo "   - Create a new repository named 'r1-mood-palette'"
echo "   - Upload the contents of r1-mood-palette-deploy folder"
echo "   - Enable GitHub Pages in repository settings"
echo "   - Your app will be available at https://yourusername.github.io/r1-mood-palette/"

echo ""
echo "2. Netlify (Easiest):"
echo "   - Go to https://app.netlify.com/drop"
echo "   - Drag and drop the r1-mood-palette-deploy folder"
echo "   - Get your deployment URL"

echo ""
echo "3. Vercel:"
echo "   - Go to https://vercel.com/"
echo "   - Sign up and create a new project"
echo "   - Import the r1-mood-palette-deploy folder"
echo "   - Get your deployment URL"

echo ""
echo "After deployment, update your mood-palette-config.json with the public URL:"
echo "{"
echo '  "title": "Mood Palette Generator",'
echo '  "url": "https://your-deployment-url.com",'
echo '  "description": "Capture images and generate AI-powered color palettes with the R1 device",'
echo '  "iconUrl": "https://your-deployment-url.com/images/icon.png",'
echo '  "themeColor": "#FE5000"'
echo "}"

echo ""
echo "Then regenerate your QR code with:"
echo "./generate-qr.sh"

echo ""
echo "Deployment package is ready: r1-mood-palette-deploy.zip"