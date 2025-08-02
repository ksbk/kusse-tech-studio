#!/bin/bash

# Build script for static assets

echo "🔨 Building static assets..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build CSS from SCSS
echo "🎨 Compiling SCSS..."
npx sass src/scss/main.scss app/static/css/main.css --style compressed

# Build JavaScript
echo "📜 Building JavaScript..."
npx webpack --mode production

# Optimize images
echo "🖼️ Optimizing images..."
# Add image optimization commands here

echo "✅ Build complete!"
