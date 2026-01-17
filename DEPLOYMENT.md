# Deployment Guide

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- Node.js 16+ (for production build)
- MongoDB database
- S3 or equivalent for file storage (optional)

## 🚀 Deployment Steps

### 1. Prepare Production Build

**Build Frontend:**
```bash
cd client
npm install
npm run build
# Output in /client/build
```

**Backend Ready:**
- Backend runs as Node.js process or Docker container
- Already optimized for production

### 2. Environment Setup

**Production .env:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trixenora
JWT_SECRET=your_very_long_random_secret_key_change_this
JWT_EXPIRE=7d
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=5000000000
```

### 3. Docker Deployment

**Production docker-compose.yml:**
```yaml
version: '3.8'

services:
  server:
    image: node:18-alpine
    container_name: trixenora-server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./server:/app
      - /app/node_modules
      - /var/uploads:/app/uploads
    working_dir: /app
    command: npm start
    restart: always

  client:
    image: node:18-alpine
    container_name: trixenora-client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    volumes:
      - ./client:/app
      - /app/node_modules
    working_dir: /app
    command: npm start
    restart: always
```

### 4. Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB URI
heroku config:set MONGODB_URI=your_mongodb_uri

# Set secrets
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### 5. Deploy to AWS

**Option A: EC2 + Docker**
1. Launch EC2 instance
2. Install Docker & Docker Compose
3. Clone repo: `git clone your-repo`
4. Set `.env` file
5. Run: `docker-compose up -d`

**Option B: Elastic Beanstalk**
```bash
eb init -p docker trixenora-app
eb create trixenora-env
eb deploy
```

### 6. Deploy to DigitalOcean

```bash
# Create droplet
# SSH into droplet

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone and run
git clone your-repo
cd Trixenora
docker-compose up -d
```

### 7. Nginx Reverse Proxy Setup

```nginx
# /etc/nginx/sites-available/trixenora

upstream api {
    server localhost:5000;
}

upstream client {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # API routes
    location /api/ {
        proxy_pass http://api;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    # Uploads
    location /uploads/ {
        alias /var/uploads/;
    }

    # Client
    location / {
        proxy_pass http://client;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/trixenora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

### 9. Database Backup

**MongoDB Atlas (Cloud):**
- Use MongoDB Atlas for managed hosting
- Automatic backups included
- Restore from snapshots

**Local MongoDB:**
```bash
# Backup
mongodump --out /backup/mongodb_$(date +%Y%m%d)

# Restore
mongorestore /backup/mongodb_20240117
```

### 10. Monitoring & Logging

**Server Logging:**
```bash
# View server logs
docker logs -f trixenora-server

# Docker Compose logs
docker-compose logs -f server
```

**Error Tracking (Optional):**
- Integrate Sentry for error tracking
- Set up ELK stack for logs
- Use Datadog for monitoring

### 11. Performance Optimization

**Frontend:**
```bash
# Enable gzip compression in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

**Database:**
- Add indexes for frequently queried fields
- Use MongoDB Atlas for managed performance
- Enable read replicas for scaling

**Caching:**
- Implement Redis for session management
- Cache API responses with nginx
- Browser caching for static files

### 12. Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS/SSL
- [ ] Enable CORS for specific domains
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] Regular security audits

### 13. Continuous Integration/Deployment

**GitHub Actions Example:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app/Trixenora
            git pull
            docker-compose restart
```

## Troubleshooting

### Application Won't Start
```bash
# Check logs
docker-compose logs server

# Verify environment variables
docker exec trixenora-server env | grep MONGO

# Test database connection
docker-compose exec server npm run test-db
```

### Database Connection Issues
```bash
# Test MongoDB connection string
mongosh "mongodb+srv://user:password@cluster.mongodb.net"

# Check network access in MongoDB Atlas
# Whitelist your server IP
```

### File Upload Issues
```bash
# Check upload directory permissions
ls -la /var/uploads/

# Fix permissions
sudo chmod 777 /var/uploads/
```

### Performance Issues
```bash
# Monitor resource usage
docker stats trixenora-server

# Check database indexes
db.games.getIndexes()
```

## Scaling

### Horizontal Scaling
- Run multiple server instances
- Use load balancer (nginx, HAProxy)
- Share uploads via S3/storage service

### Database Scaling
- MongoDB sharding
- Read replicas
- Connection pooling

### Caching Strategy
- Redis for sessions
- CDN for static files
- API response caching

## Post-Deployment

1. **Verify Services**
   - Test website at your domain
   - Test API endpoints
   - Test file uploads

2. **Monitor**
   - Set up error tracking
   - Monitor server resources
   - Check logs regularly

3. **Maintain**
   - Regular backups
   - Security updates
   - Performance optimization

4. **Scale**
   - Monitor growth
   - Add resources as needed
   - Optimize bottlenecks
