# Development Guide

## Project Overview
Trixenora is a full-stack application for uploading and sharing games and AI tools.

## File Structure

### Backend (`/server`)
- **server.js**: Main Express app and middleware setup
- **models/**: MongoDB schemas (User, Game, AITool)
- **routes/**: API endpoint definitions
- **middleware/**: Auth and file upload middleware
- **uploads/**: Directory for stored files

### Frontend (`/client`)
- **public/**: Static HTML
- **src/App.js**: Root component with routing
- **components/**: Reusable UI components
- **pages/**: Page-level components
- **styles/**: CSS modules

## Running Locally

### Option 1: Docker (Recommended)
```bash
docker-compose up -d
cd server && npm install
cd ../client && npm install && npm start
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Server
cd server
npm install
npm run dev

# Terminal 2 - Client
cd client
npm install
npm start
```

## Key Technologies

### Backend
- Express.js for routing
- MongoDB for data persistence
- JWT for authentication
- Multer for file uploads
- Bcryptjs for password hashing

### Frontend
- React Hooks for state management
- React Router for navigation
- Axios for API calls
- CSS Grid/Flexbox for layout

## Common Tasks

### Adding a New Feature

1. **Backend**
   - Add model in `/server/models`
   - Create routes in `/server/routes`
   - Add middleware if needed
   - Update server.js to include new routes

2. **Frontend**
   - Create component in `/src/components` or `/src/pages`
   - Add route in `App.js`
   - Create associated CSS in `/src/styles`
   - Update navigation as needed

### Creating an API Endpoint

```javascript
// In /server/routes/example.js
router.post('/create', auth, async (req, res) => {
  try {
    // Validate input
    const { title, description } = req.body;
    
    // Create resource
    const resource = new Resource({
      title,
      description,
      creator: req.user.id
    });
    
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Using API in Frontend

```javascript
// In React component
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/endpoint', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(data => setData(data))
  .catch(err => console.error(err));
}, []);
```

## Database Schema

### User
- username (unique)
- email (unique)
- password (hashed)
- displayName
- bio
- role (user, developer, admin)
- followers/following
- createdAt

### Game
- title
- description
- developer (ref to User)
- platforms (array)
- genre
- downloadUrl
- downloads (counter)
- rating (1-5)
- reviews (array)
- status (draft, published, archived)
- createdAt

### AITool
- name
- description
- creator (ref to User)
- category
- fileUrl
- downloads (counter)
- rating (1-5)
- status (development, beta, released)
- reviews (array)
- createdAt

## Environment Setup

### .env (Server)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trixenora
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## Testing

### Manual API Testing with cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Get games
curl http://localhost:5000/api/games
```

## Performance Tips

1. **Database**: Add indexes to frequently queried fields
2. **Caching**: Implement Redis for popular content
3. **File Storage**: Consider using S3 or CDN for files
4. **Frontend**: Use React.memo for expensive components
5. **API**: Implement pagination for list endpoints

## Debugging

### Server Issues
1. Check `.env` file exists with correct values
2. Verify MongoDB is running: `docker-compose ps`
3. Check logs: `npm run dev` shows all console output

### Frontend Issues
1. Open browser DevTools (F12)
2. Check Network tab for failed API calls
3. Check Console for JavaScript errors
4. Verify proxy in `package.json`

## Deployment

### Build Frontend
```bash
cd client
npm run build
# Output in /client/build
```

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set MONGODB_URI=your_production_db
```

## Security Best Practices

1. ✅ Hash passwords with bcryptjs
2. ✅ Use JWT with expiration
3. ✅ Validate all inputs
4. ✅ Sanitize file uploads
5. ✅ Use HTTPS in production
6. ✅ Set secure CORS policies
7. ✅ Never commit .env to git
8. ✅ Use environment variables for secrets

## Troubleshooting

### Port Already in Use
```bash
# Find process on port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongodb
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```
