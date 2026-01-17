# Quick Start Guide

## 🚀 Getting Started with Trixenora

### 1. Prerequisites
- Node.js 16+
- Docker & Docker Compose
- Git

### 2. Clone & Install
```bash
cd /workspaces/Trixenora

# Make scripts executable
chmod +x install.sh dev-setup.sh

# Run installation
./install.sh
```

### 3. Setup Development Environment
```bash
./dev-setup.sh
```

### 4. Start Services

**Option A: Using Docker (Recommended)**
```bash
# Start MongoDB in background
docker-compose up -d

# Verify it's running
docker-compose ps
```

**Option B: Local MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

### 6. First Steps in App
1. Visit `http://localhost:3000`
2. Click "Sign In" or create account
3. Complete profile setup
4. Start uploading games or AI tools

## 📝 File Uploads

### Supported Formats
- Games: `.zip`, `.apk`, `.exe`, `.rar`, `.7z`, `.tar`, `.gz`
- Thumbnails: `.jpg`, `.png`, `.gif`, `.webp`

### Upload Limits
- Max file size: 5GB
- Supported platforms: Android, iOS, Mac, Windows, Linux

## 🎮 Game Upload Checklist
- [ ] Game title
- [ ] Description
- [ ] Target platforms (Android, Mac, Windows, etc.)
- [ ] Game genre
- [ ] Minimum requirements
- [ ] Game file (ZIP or format)
- [ ] Thumbnail image (optional)

## 🤖 AI Tool Upload Checklist
- [ ] Tool name
- [ ] Description
- [ ] Category (Image Gen, Text Gen, etc.)
- [ ] Documentation
- [ ] Requirements/Dependencies
- [ ] Tool file
- [ ] Thumbnail image (optional)

## 🔧 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myusername",
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get All Games
```bash
curl http://localhost:5000/api/games
```

### Get Platform Statistics
```bash
curl http://localhost:5000/api/dashboard/stats
```

## 📊 Admin Tasks

### Access MongoDB
```bash
# Connect to MongoDB container
docker exec -it trixenora-db mongosh -u admin -p password
```

### View Collections
```javascript
use trixenora
db.users.find()
db.games.find()
db.aitools.find()
```

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000 (server)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (client)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### MongoDB Connection Failed
```bash
# Verify Docker is running
docker ps

# Restart MongoDB
docker-compose restart mongodb
```

### Module Not Found
```bash
# Clear and reinstall
cd server && rm -rf node_modules && npm install
cd ../client && rm -rf node_modules && npm install
```

### JWT Token Expired
- Tokens expire after 7 days
- Log out and log back in to get a new token

## 📚 Documentation
- [API Documentation](./API.md) - Detailed endpoint reference
- [Development Guide](./DEVELOPMENT.md) - Architecture and development tips
- [Main README](./README.md) - Full project documentation

## 🎯 Next Steps

1. **Explore Features**
   - Browse games and AI tools
   - Leave reviews
   - Follow developers

2. **Upload Content**
   - Create your first game
   - Upload an AI tool
   - Manage from dashboard

3. **Customize Profile**
   - Add avatar
   - Write bio
   - Follow other developers

4. **Deploy** (Coming soon)
   - Docker Compose setup
   - Heroku deployment guide
   - Environment variables

## 💡 Tips

- Save your JWT token from login for API testing
- Use browser DevTools Console for frontend debugging
- Check server logs for API errors
- Create test accounts with different roles
- Upload small test files first

## 🆘 Need Help?

- Check [API Documentation](./API.md)
- Review [Development Guide](./DEVELOPMENT.md)
- Check logs in both terminals
- Open browser DevTools (F12) for frontend issues

## 🎉 You're All Set!

Start building and sharing amazing games and AI tools!
