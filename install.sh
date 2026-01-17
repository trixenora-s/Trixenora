#!/bin/bash
# Installation and Setup Script

echo "🚀 Installing Trixenora Platform..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
echo "✅ Server dependencies installed"

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install
echo "✅ Client dependencies installed"

echo "✨ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Start MongoDB: docker-compose up -d"
echo "2. In terminal 1: cd server && npm run dev"
echo "3. In terminal 2: cd client && npm start"
echo ""
echo "🎉 Your Trixenora platform will be running at http://localhost:3000"
