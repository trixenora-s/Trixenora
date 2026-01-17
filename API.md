# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Auth

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "username": "developer",
  "email": "dev@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "developer",
    "email": "dev@example.com"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt_token",
  "user": { ... }
}
```

### Games

#### Get All Games
```
GET /games?platform=android&genre=action&search=term

Query Parameters:
- platform: android|ios|mac|windows|linux
- genre: string
- search: string

Response: Array of game objects
```

#### Get Game Detail
```
GET /games/:id

Response:
{
  "_id": "game_id",
  "title": "Game Title",
  "description": "...",
  "developer": { "username": "...", "avatar": "..." },
  "platforms": ["android", "windows"],
  "genre": "action",
  "version": "1.0.0",
  "downloadUrl": "/uploads/...",
  "downloads": 150,
  "rating": 4.5,
  "reviews": [...],
  ...
}
```

#### Upload Game
```
POST /games/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- title: string (required)
- description: string
- platforms: string (JSON array) ["android", "windows"]
- genre: string
- version: string
- minRequirements: string
- file: file (required)
- thumbnail: file

Response: Created game object
```

#### Publish Game
```
PATCH /games/:id/publish
Authorization: Bearer <token>

Response: Updated game object with status="published"
```

#### Add Review
```
POST /games/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Amazing game!"
}

Response: Updated game with new review
```

### AI Tools

#### Get All Tools
```
GET /ai-tools?category=image-generation&search=term

Query Parameters:
- category: image-generation|text-generation|video-generation|code-generation|data-analysis|other
- search: string

Response: Array of tool objects
```

#### Get Tool Detail
```
GET /ai-tools/:id

Response: Tool object (similar to game)
```

#### Upload Tool
```
POST /ai-tools/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- name: string (required)
- description: string
- category: string
- version: string
- documentation: string
- requirements: string
- file: file (required)
- thumbnail: file

Response: Created tool object
```

#### Update Tool Status
```
PATCH /ai-tools/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "development|beta|released|deprecated"
}

Response: Updated tool object
```

#### Add Review
```
POST /ai-tools/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Very useful!"
}

Response: Updated tool with new review
```

### Users

#### Get User Profile
```
GET /users/:username

Response:
{
  "username": "developer",
  "displayName": "John Doe",
  "bio": "Game developer",
  "gamesUploaded": [...],
  "aiToolsUploaded": [...],
  "followers": [...],
  "following": [...]
}
```

#### Update Profile
```
PATCH /users/profile/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "bio": "Indie game developer",
  "avatar": "url_to_avatar"
}

Response: Updated user object
```

#### Follow User
```
POST /users/:id/follow
Authorization: Bearer <token>

Response:
{
  "message": "User followed"
}
```

### Dashboard

#### Get User Dashboard
```
GET /dashboard/me
Authorization: Bearer <token>

Response:
{
  "user": { ... },
  "gameStats": {
    "total": 5,
    "published": 3,
    "totalDownloads": 1250
  },
  "toolStats": {
    "total": 2,
    "released": 1,
    "totalDownloads": 450
  },
  "recentGames": [...],
  "recentTools": [...]
}
```

#### Get Platform Stats
```
GET /dashboard/stats

Response:
{
  "totalUsers": 250,
  "totalGames": 150,
  "totalTools": 75,
  "totalDownloads": 50000
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message",
  "errors": [{ "msg": "Validation error" }]
}
```

### 401 Unauthorized
```json
{
  "error": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```
