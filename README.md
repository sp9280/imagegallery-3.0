# ImageGallery 3.0

> An intelligent, high-resolution visual sanctuary with automated EXIF DNA detection, camera optics analysis, and AI-generated artwork classification.

[![Version](https://img.shields.io/badge/version-3.0.0-cyan?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)]()
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)]()
[![Node](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479a1?style=flat-square&logo=mysql&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)]()

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Default Demo Accounts](#default-demo-accounts)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ImageGallery 3.0 is a full-stack creative visual platform where photographers and generative artists can publish, share, and discover high-resolution imagery. The platform automatically extracts and enriches every upload with comprehensive EXIF metadata — including camera model, lens, aperture, focal length, resolution, GPS location, capture date, and intelligent AI-generation detection.

Built with a **React 18** frontend powered by **Tailwind CSS** and **Framer Motion**, and a **Node.js/Express** backend with **MySQL/Sequelize** ORM, the application delivers a stunning, responsive, dark-mode-capable experience from start to finish.

---

## Key Features

### Core Gallery

- **Responsive Masonry & Grid Layouts** — Toggle between grid and masonry views for browsing
- **Advanced Search** — Search by title, camera model, aperture, resolution, tags, and prompt keywords
- **Category Filtering** — Curated collections: Nature & Wildlife, Architecture, Digital Art & 3D, General
- **Medium Toggle** — Filter between Optical Photography and AI-Generated artwork
- **Lightbox Viewer** — Full-screen image modal with detailed metadata, comments, and social actions
- **Infinite Scroll** — Seamless loading of gallery content

### Intelligent EXIF Auto-Detection (Image DNA)

- **Camera Make & Model** — Auto-extracted from EXIF (e.g., Sony A7 IV, Canon EOS R5)
- **Camera Type Heuristic** — Classifies as Mirrorless, DSLR, Smartphone, Drone, or Medium Format
- **Resolution Detection** — Native pixel dimensions (e.g., 6000x4000)
- **Aperture (f-stop)** — Automatically parsed (e.g., f/1.8, f/2.8)
- **Focal Length** — Lens focus distance (e.g., 50mm, 24-70mm)
- **GPS Location** — Latitude/longitude with reverse-geocoded place name
- **Capture Date & Time** — Original photo timestamp
- **Photographer Credit** — Extracted from Artist/Creator/Copyright EXIF tags

### AI Generation Detection

- Automatically detects AI-generated images by analyzing software signatures
- Recognizes engines: **Midjourney, DALL-E, Stable Diffusion, ComfyUI, Adobe Firefly, NovelAI, Flux.1**
- Displays AI model badge on cards and in the lightbox

### Authentication & User System

- **JWT-based authentication** with secure token storage
- **Email verification** with 6-digit code (Nodemailer integration)
- **Role-based access control** (user / admin)
- **Profile management** — nickname, phone, secondary email, creative domain, experience level
- **Protected routes** — Upload, Profile, and Admin areas require authentication

### Admin Dashboard

- **User Management** — View, manage, and control user accounts
- **Image Management** — Moderate, hide/unhide, and delete media
- **System Analytics** — Platform statistics and visitor tracking
- **Admin Scope Toggle** — Admins can view all platform media from their profile

### Social & Engagement

- **Likes** — Device-based one-like-per-device enforcement (authenticated users)
- **Comments** — Threaded commenting system on each media item
- **Downloads** — One-click image download with original filename
- **View Tracking** — Impression counting

### Privacy & Content Control

- **Public/Private uploads** — Toggle visibility on the global feed
- **Hide/Unhide system** — Admins can hide content with reason tracking
- **Terms & Conditions acceptance** — Modal-based T&C tracking
- **Cookie consent** — GDPR-compliant cookie consent banner

### Design & UX

- **Cyber-Obsidian Aurora theme** — Dark, premium visual aesthetic with cyan/violet/pink gradients
- **Glassmorphism UI** — Frosted glass cards, blur effects, and translucent surfaces
- **Ambient glow orbs** — Floating background blur elements for depth
- **Full dark/light mode** — Persisted theme preference with smooth transitions
- **PWA support** — Service worker, manifest, offline caching via Workbox
- **Responsive design** — Optimized for mobile, tablet, and desktop
- **Animated transitions** — Framer Motion page transitions and micro-interactions
- **Keyboard shortcuts** — Ctrl+K / Cmd+K to focus search

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Heroicons / React Icons | Icon library |
| Axios | HTTP client |
| exifr | Client-side EXIF parsing |
| React Toastify | Toast notifications |
| React Masonry CSS | Masonry layout |
| React Image Crop | Image cropping |
| Socket.io Client | Real-time communication |
| Workbox | PWA service worker |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MySQL + Sequelize ORM | Database & data modeling |
| JWT (jsonwebtoken) | Authentication tokens |
| Bcryptjs | Password hashing |
| Multer | File upload handling |
| Nodemailer | Email verification |
| Winston | Structured logging |
| Morgan | HTTP request logging |
| Helmet | Security headers |
| Express Rate Limit | API rate limiting |
| Socket.io | Real-time events |
| UA-Parser.js | Visitor device analytics |

---

## Project Structure

```
Imagegallery 3.0/
├── client/                          # React frontend application
│   ├── public/                      # Static assets & PWA manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # AdminPanel, Dashboard, ManageUsers, ManageImages
│   │   │   ├── auth/                # Login, Register, LogoutButton
│   │   │   ├── common/              # Spinner, Alert, Toast, ProtectedRoute, TermsModal
│   │   │   ├── gallery/             # MediaCard, ImageModal, Upload, Comments, SocialActions
│   │   │   └── layout/              # Header, Footer, Sidebar, Layout
│   │   ├── context/                 # AuthContext, GalleryContext
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Home, Profile, Categories, Terms, Privacy, NotFound
│   │   ├── services/                # API client & service modules
│   │   ├── styles/                  # Tailwind CSS, enhanced.css, theme.js
│   │   ├── utils/                   # Geo utilities & helpers
│   │   ├── App.js                   # Root component with routing
│   │   └── index.js                 # Entry point
│   ├── tailwind.config.js           # Tailwind theme configuration
│   └── package.json
│
├── server/                          # Node.js/Express backend
│   ├── config/                      # Database, logger configuration
│   ├── controllers/                 # Route controller logic
│   ├── middleware/                  # Auth, role, error handling, visitor tracking
│   ├── migrations/                  # Database migrations
│   ├── models/                      # Sequelize models (User, Media, Visitor, etc.)
│   ├── routes/                      # API route definitions
│   ├── services/                    # Business logic services
│   ├── uploads/                     # Uploaded media storage
│   ├── utils/                       # Server-side utilities
│   ├── seed.js                      # Database seeding script
│   ├── server.js                    # Express server entry point
│   └── package.json
│
├── package.json                     # Root package.json (concurrently runner)
└── README.md                        # This file
```

---

## Prerequisites

- **Node.js** v16+ (recommended v18+)
- **npm** v8+ or **yarn**
- **MySQL** or **MariaDB** (v10.3+) running on `localhost:3306`
  - Alternatively, configure `MYSQLD_PATH` and `DB_DATA_DIR` in `.env` for auto-start

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Imagegallery\ 3.0
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install client and server dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

Or use the built-in scripts:

```bash
npm run install-server
npm run install-client
```

### 4. Configure environment variables

Create a `.env` file in the `server/` directory (see [Environment Configuration](#environment-configuration)).

### 5. Start the application

From the project root:

```bash
npm start
```

This runs both the server (port 4000) and client (port 3000) concurrently using `concurrently`.

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Alternative: Run separately

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

---

## Environment Configuration

Create a `server/.env` file with the following variables:

```env
# Server
PORT=4000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=imagegallery
DB_USER=root
DB_PASSWORD=your_mysql_password

# Optional: Auto-start local MySQL/MariaDB
# MYSQLD_PATH=/path/to/mysqld
# DB_DATA_DIR=/path/to/mysql/data

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Email (for verification codes)
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@imagegallery.com
```

For the frontend, create a `client/.env` file (optional):

```env
REACT_APP_API_URL=http://localhost:4000/api
```

---

## Default Demo Accounts

The database auto-seeds two demo accounts on first connection:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `Admin@123` |
| User | `user@example.com` | `User@123` |

You can use the **"Quick Fill"** buttons on the Login page to auto-populate these credentials.

---

## Available Scripts

### Root (Project)

| Command | Description |
|---|---|
| `npm start` | Starts both server and client concurrently |
| `npm run server` | Starts the backend server only |
| `npm run client` | Starts the frontend dev server only |
| `npm run build` | Builds the client for production |
| `npm run install-server` | Installs server dependencies |
| `npm run install-client` | Installs client dependencies |

### Client

| Command | Description |
|---|---|
| `npm start` | Starts the React dev server (port 3000) |
| `npm run build` | Builds the production bundle |
| `npm test` | Runs the test suite |

### Server

| Command | Description |
|---|---|
| `npm start` | Starts the Express server (port 4000) |
| `npm run dev` | Starts with nodemon (auto-restart) |
| `npm test` | Runs server tests |

---

## API Reference

### Base URL

```
http://localhost:4000/api
```

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user account | No |
| POST | `/login` | Authenticate user & get JWT | No |
| POST | `/verify-email` | Verify email with 6-digit code | No |

### Media Routes (`/api/media`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/public` | Fetch public gallery media | No |
| GET | `/browse` | Browse media (authenticated) | Yes |
| GET | `/user` | Get current user's media | Yes |
| GET | `/user?scope=all` | Get all platform media (admin only) | Admin |
| GET | `/category/:category` | Get media by category | No |
| POST | `/upload` | Upload new media with EXIF | Yes |
| POST | `/:id/like` | Toggle like on media | Yes |
| GET | `/:id/like-status` | Check like status | Yes |
| PATCH | `/:id` | Edit media details (owner/admin) | Yes |
| DELETE | `/:id` | Delete media (owner/admin) | Yes |
| PATCH | `/:id/hide` | Hide media with reason (admin) | Admin |
| PATCH | `/:id/unhide` | Unhide media (admin) | Admin |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users` | List all users | Admin |
| PATCH | `/users/:id` | Update user role/status | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/media` | List all media (including hidden) | Admin |
| DELETE | `/media/:id` | Delete any media | Admin |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/profile` | Get user profile | Yes |
| PATCH | `/profile` | Update profile details | Yes |

### Visitor Routes (`/api/visitor`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/stats` | Get visitor analytics | Admin |
| GET | `/tracking` | Get visitor tracking data | Admin |

---

## Design System

### Color Palette

The platform uses a **Cyber-Obsidian Aurora** theme with the following core palette:

| Color | Hex | Usage |
|---|---|---|
| Cyan | `#00f5d4` | Primary accents, active states, glows |
| Violet | `#a855f7` | Secondary accents, gradients |
| Pink | `#ec4899` | Tertiary accents, AI badges |
| Obsidian Dark | `#070913` | Dark mode background |
| Slate Light | `#f8fafc` | Light mode background |

### Typography

- **Primary Font**: Inter (system-ui fallback)
- **Headings**: Black weight (900) with tight tracking
- **Body**: Normal weight with relaxed leading

### Key Visual Effects

- **Glassmorphism** — Translucent frosted glass cards with backdrop blur
- **Ambient Glow Orbs** — Large blurred color circles for atmospheric depth
- **Gradient Borders** — Animated cyan-violet-pink gradient outlines
- **Neon Shadows** — Glowing box-shadows on interactive elements
- **Cyber Grid Texture** — Subtle radial dot pattern overlays
- **Smooth Transitions** — Cubic-bezier easing throughout

### Animations

- `fade-in-up` / `fade-in-down` — Page and element entrance
- `scale-in` — Modal and card scaling
- `float` — Floating decorative elements
- `glow-pulse` — Pulsing glow on live indicators
- `aurora` — Animated gradient background shift
- `bounce-in` — Playful element entrance
- `gradient-x` — Animated gradient text shimmer

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Guidelines

- Follow existing code style (Prettier/ESLint defaults)
- Use Tailwind utility classes for styling
- Ensure responsive design for all new components
- Support both light and dark mode
- Add EXIF auto-detection for any new upload-related features

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Crafted with <span style="color: #ec4899;">♥</span> for photographers and generative artists worldwide.
  <br/>
  <strong>ImageGallery 3.0</strong> — Where Visual Art Transcends Perfection.
</p>
