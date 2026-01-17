#!/bin/bash
# Deploy Trixenora to GitHub Pages
set -e

cd "$(dirname "$0")"

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   🚀 TRIXENORA - GITHUB PAGES DEPLOYMENT          ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

echo "📦 Building React application..."
cd /workspaces/Trixenora/client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📁 Creating docs folder for GitHub Pages..."
rm -rf /workspaces/Trixenora/docs
mkdir -p /workspaces/Trixenora/docs

echo "📋 Copying built files to docs..."
cp -r /workspaces/Trixenora/client/build/* /workspaces/Trixenora/docs/

# Copy SEO files
cd /workspaces/Trixenora
echo "🔍 Adding SEO files..."
if [ -f "public/robots.txt" ]; then
    cp public/robots.txt /workspaces/Trixenora/docs/
    echo "   ✓ robots.txt"
fi
if [ -f "public/sitemap.xml" ]; then
    cp public/sitemap.xml /workspaces/Trixenora/docs/
    echo "   ✓ sitemap.xml"
fi

echo "✅ Files copied successfully!"
echo ""
echo "🚀 Deploy to GitHub Pages:"
echo "   cd /workspaces/Trixenora"
echo "   git add docs/"
echo "   git commit -m 'Deploy to GitHub Pages'"
echo "   git push origin main"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://trixenora-s.github.io/Trixenora/"
