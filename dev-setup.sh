#!/bin/bash
# Development Setup Script

echo "🔧 Setting up development environment..."

# Create uploads directory
mkdir -p server/uploads
echo "✅ Created uploads directory"

# Copy .env if not exists
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created .env file (edit with your settings)"
else
    echo "⚠️  .env file already exists"
fi

echo "✨ Development setup complete!"
