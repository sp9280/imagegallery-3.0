# 📦 ImageGallery 3.0 - Installation & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

---

## 📥 Installation Steps

### 1. Install Dependencies

#### Backend (Server)
```powershell
cd server
npm install
```

#### Frontend (Client)
```powershell
cd client
npm install
```

### 2. Environment Configuration

#### Server Configuration
File: `server/.env`
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/imagegallery
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
NODE_ENV=development
```

#### Client Configuration
File: `client/.env`
```env
REACT_APP_API_URL=http://localhost:4000/api
```

### 3. Start MongoDB
```powershell
# If using local MongoDB
mongod
```

Or use MongoDB Atlas (cloud) and update the `MONGO_URI` in server/.env

### 4. Run the Application

#### Option A: Run Separately (Development)

**Terminal 1 - Start Backend:**
```powershell
cd server
npm start
```

**Terminal 2 - Start Frontend:**
```powershell
cd client
npm start
```

#### Option B: Run Concurrently (If configured)
```powershell
npm start
```

---

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **MongoDB:** mongodb://localhost:27017

---

## 🎨 Feature Testing Checklist

### ✅ Basic Features
- [ ] Browse gallery (public access)
- [ ] User registration
- [ ] User login
- [ ] Image upload
- [ ] Search functionality
- [ ] Category filtering

### ✅ Enhanced Features
- [ ] Theme switching (light/dark)
- [ ] Masonry layout view
- [ ] Grid layout view
- [ ] Infinite scroll
- [ ] Image modal with details
- [ ] Like functionality
- [ ] Share functionality
- [ ] Save/bookmark

### ✅ Advanced Features
- [ ] Image editor (brightness, contrast, saturation)
- [ ] Social actions (likes, comments, shares)
- [ ] Touch gestures (mobile)
- [ ] PWA installation
- [ ] Offline support
- [ ] Loading skeletons
- [ ] Toast notifications

### ✅ Responsive Design
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640-1024px)
- [ ] Test on desktop (1024-1536px)
- [ ] Test on wide screen (> 1536px)

### ✅ Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Focus indicators
- [ ] ARIA labels

---

## 🐛 Troubleshooting

### Issue: Dependencies Installation Fails
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: MongoDB Connection Error
**Solution:**
1. Ensure MongoDB is running
2. Check MONGO_URI in server/.env
3. Verify MongoDB port (default: 27017)

### Issue: Port Already in Use
**Solution:**
```powershell
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 4000 (backend)
npx kill-port 4000
```

### Issue: React App Not Starting
**Solution:**
```powershell
# Set environment variable
$env:NODE_OPTIONS="--no-deprecation"

# Then start
npm start
```

### Issue: Images Not Loading
**Solution:**
1. Check uploads folder exists: `server/uploads/`
2. Verify backend URL in client/.env
3. Check CORS configuration in server

---

## 🔧 Build for Production

### Frontend Build
```powershell
cd client
npm run build
```

Output: `client/build/` folder

### Backend Production
```powershell
cd server

# Update .env
NODE_ENV=production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name imagegallery-api
```

---

## 📦 Deployment Options

### Option 1: Vercel (Frontend) + Heroku (Backend)
```powershell
# Frontend to Vercel
cd client
vercel deploy

# Backend to Heroku
cd server
heroku create imagegallery-api
git push heroku main
```

### Option 2: Netlify (Frontend) + Railway (Backend)
```powershell
# Frontend to Netlify
cd client
npm run build
netlify deploy --prod --dir=build

# Backend to Railway
# Use Railway dashboard to connect GitHub repo
```

### Option 3: Docker (Full Stack)
```dockerfile
# Create Dockerfile for client and server
# Use docker-compose for orchestration
docker-compose up -d
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random string
- [ ] Update MongoDB credentials
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Set secure cookie options
- [ ] Add helmet.js security headers
- [ ] Enable CSRF protection
- [ ] Configure Content Security Policy

---

## 📊 Performance Optimization

### Frontend
```powershell
# Analyze bundle size
cd client
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Backend
```javascript
// Enable compression
npm install compression
// Add to server.js
const compression = require('compression');
app.use(compression());
```

### Database
```javascript
// Add indexes to MongoDB
db.media.createIndex({ title: "text", description: "text" })
db.media.createIndex({ category: 1 })
db.media.createIndex({ createdAt: -1 })
```

---

## 🧪 Testing

### Run Tests
```powershell
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

### Coverage Report
```powershell
npm test -- --coverage
```

---

## 📱 PWA Setup

### Generate Icons
Use a tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator):

```powershell
npx pwa-asset-generator logo.png ./public/icons
```

### Test PWA
1. Build production version
2. Serve with HTTPS
3. Use Chrome DevTools > Application > Manifest
4. Test "Install App" feature

---

## 🎯 Next Steps

1. ✅ Complete installation
2. ✅ Test all features
3. ✅ Customize branding (logo, colors)
4. ✅ Add custom categories
5. ✅ Configure email service
6. ✅ Set up analytics
7. ✅ Deploy to production
8. ✅ Monitor performance

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Manual](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)

---

## 🆘 Support

If you encounter any issues:

1. Check this guide first
2. Review error messages carefully
3. Check browser console for errors
4. Verify all environment variables
5. Ensure all dependencies are installed
6. Check MongoDB connection

---

## 🎉 Congratulations!

Your ImageGallery 3.0 is now ready to use! Enjoy the stunning design and amazing features! ✨

**Happy coding! 🚀**