ImageGallery 3.0/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
│
├── .env.example                           # Environment variables template
│
├── .dockerignore                          # Docker ignore rules
│
├── docker-compose.yml                     # Docker Compose configuration
│
├── nginx.conf                             # Nginx configuration for reverse proxy and SSL termination
│
├── ssl/
│   ├── cert.pem                           # SSL certificate file (replace with your own)
│   ├── key.pem                            # SSL private key file (replace with your own)
│   
├── client/                               # React Frontend
│   ├── package.json✅
│   ├── package-lock.json
│   ├── public/
│   │   ├── index.html✅
│   │   ├── favicon.ico
│   │   ├── robots.txt✅
│   │   ├── privacy.html✅
│   │   └── terms.html✅
│   │
│   └── src/
│       ├── App.js✅
│       ├── index.js✅
│       ├── tailwind.css✅
│       │
│       ├── assets/                       # Local images, icons, or placeholders
│       │   ├── logo.png
│       │   └── placeholder.jpg
│       │
│       ├── components/                   # UI Components
│       │   ├── layout/
│       │   │   ├── Header.js✅
│       │   │   ├── Footer.js✅
│       │   │   └── Sidebar.js✅
│       │   │
│       │   ├── auth/
│       │   │   ├── Login.js✅
│       │   │   ├── Register.js✅
│       │   │   └── LogoutButton.js✅
│       │   │
│       │   ├── gallery/
│       │   │   ├── Gallery.js✅
│       │   │   ├── MediaCard.js✅
│       │   │   ├── Upload.js✅
│       │   │   └── Comments.js✅
│       │   │
│       │   ├── common/
│       │   │   ├── CookieConsent.js✅
│       │   │   ├── Spinner.js✅
│       │   │   └── Alert.js✅
│       │   │
│       │   └── admin/
│       │       ├── AdminPanel.js✅
│       │       ├── ManageUsers.js✅
│       │       └── Dashboard.js✅
│       │
│       ├── context/
│       │   ├── AuthContext.js✅
│       │   └── GalleryContext.js✅
│       │
│       ├── hooks/
│       │   ├── useAuth.js✅
│       │   └── useApi.js✅
│       │
│       ├── pages/
│       │   ├── Home.js✅
│       │   ├── Profile.js✅
│       │   ├── Categories.js✅
│       │   ├── Terms.js✅
│       │   ├── Privacy.js✅
│       │   └── NotFound.js✅
│       │
│       ├── services/
│       │   ├── api.js✅
│       │   ├── socket.js✅
│       │   └── authService.js✅
│       │
│       └── styles/
│           ├── style.css✅
│           └── theme.js✅
│
│
├── server/                               # Node.js Backend
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js✅
│   ├── combined.log
│   ├── error.log
│   │
│   ├── config/
│   │   ├── db.js                         # MongoDB connection
│   │   └── logger.js ✅                    # Winston logger setup
│   │
│   ├── controllers/
│   │   ├── mediaController.js            # Central export for media routes
│   │   ├── media/
│   │   │   ├── authController.js✅
│   │   │   ├── uploadController.js✅
│   │   │   ├── browseController.js✅
│   │   │   ├── publicController.js
│   │   │   ├── adminController.js✅
│   │   │   └── statsController.js✅
│   │   │
│   │   └── utils/
│   │       ├── db.js✅
│   │       ├── fileValidator.js✅
│   │       └── imageOptimizer.js✅
│   │
│   ├── middleware/
│   │   ├── auth.js✅
│   │   ├── role.js✅
│   │   └── errorHandler.js✅
│   │
│   ├── models/
│   │   ├── User.js✅
│   │   └── Media.js✅
│   │
│   ├── routes/
│   │   ├── authRoutes.js✅
│   │   ├── mediaRoutes.js✅
│   │   └── adminRoutes.js✅
│   │
│   ├── services/
│   │   ├── socket.js✅
│   │   └── mailService.js✅
│   │
│   ├── utils/
│   │   ├── generateToken.js✅
│   │   ├── response.js✅
│   │   └── constants.js✅
│   │
│   └── uploads/                          # Media uploads (images/videos)
│
└── README.md
