# ReLoop — Full-Stack MERN Marketplace for Pre-Owned Goods

> **"Good things deserve a second life."**

ReLoop is a modern, production-grade second-hand goods marketplace built with the MERN stack (MongoDB, Express, React, Node.js). Inspired by modern e-commerce standards and platforms like OLX and Facebook Marketplace, ReLoop empowers conscious circular commerce by connecting local buyers and sellers to discover, buy, sell, and negotiate pre-owned items safely in real-time.

---

## 🌟 Key Features

### 🛍️ Marketplace & Product Discovery
- **Rich Editorial Aesthetic**: Curated color palette with deep emerald green (`#065f46`), warm off-white background (`#faf9f6`), and crisp card surfaces.
- **Dynamic Database-Side Filtering**: Category filtering, price range bounds (Min/Max ₹), condition selector (Like New, Good, Fair), and city selection.
- **Search & URL Synchronization**: Real-time keyword search query params synced directly to the URL (`/browse?search=iphone&category=...`).
- **Detailed Product Page**: Large image gallery with thumbnail navigation, fullscreen zoom lightbox, price in INR (₹), condition badges, and seller metrics.
- **Favorites & Wishlist**: Optimistic favorite toggling, synchronized across listing cards, detail pages, and a dedicated wishlist page.
- **Similar Recommendations**: Automatic categorization matching recommending related products on detail pages.

### 📸 Real Image Upload System
- **Dual Cloud & Local Storage Architecture**:
  - Direct Cloudinary integration with automatic image resizing and optimization when credentials are configured.
  - Zero-config local disk storage fallback (`/uploads/`) so the app runs instantly out of the box without any external cloud accounts.
- **Multiple Image Upload**: Upload up to 8 images per product with file type and 5MB size validation.
- **Cover Image Selector**: Select which photo serves as the listing thumbnail.

### 💬 Real-Time Buyer-Seller Chat
- **Socket.IO Real-Time Messaging**: Instant peer-to-peer chat without polling.
- **Product Context Header**: Current product preview, pricing, and status embedded directly into the chat header.
- **Online Presence & Typing Indicators**: Real-time online/offline indicator for conversation partners.
- **Strict Authorization**: Only verified participants can read or send messages in a conversation. Users cannot message themselves.

### 👤 User Dashboard & Listing Management
- **Status Workflow**: Mark products as `active`, `reserved`, or `sold`.
- **My Listings Hub**: Filter own listings by Active, Reserved, and Sold tabs.
- **Full Ownership Protection**: Only the product creator can edit, delete, or change status.
- **Profile Management**: Customize avatar, location, phone number, and view member tenure.

### 🛡️ Safety & Moderation
- **Listing Reports**: Built-in reporting system (`/api/reports`) with categorised violation reasons for community safety.
- **Rate Limiting**: Protects authentication endpoints from brute-force attempts.
- **Security Headers**: Helmet integration with cross-origin resource policy for secure image serving.
- **Password Hashing**: Secure salted bcrypt hashing before persistence.
- **HttpOnly Cookies & Bearer Tokens**: Dual support for browser cookies and JWT Authorization headers.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v7, Axios, Lucide React, Socket.IO Client |
| **Backend** | Node.js, Express.js, MongoDB / Mongoose, Socket.IO, Multer, Cloudinary SDK |
| **Security & Auth** | JWT, bcryptjs, Helmet, Express-Rate-Limit, Cookie-Parser |
| **Testing** | Node.js native test runner (`node --test`), Supertest, MongoMemoryServer |

---

## 📁 Repository Structure

```
reloop/
├── frontend/                   # Frontend Vite + React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Navbar, Footer, Badges, Modals, Pagination
│   │   │   ├── home/           # Hero, CategoryGrid, HowItWorks, Stats
│   │   │   ├── products/       # ProductCard, Grid, FilterSidebar, Gallery, Uploader
│   │   │   └── chat/           # ChatWindow, ConversationList
│   │   ├── context/            # AuthContext, SocketContext, FavoritesContext
│   │   ├── pages/              # 10 Application Pages
│   │   ├── services/           # Axios API services (auth, product, chat, user)
│   │   ├── utils/              # Category constants, helpers, currency formatter
│   │   ├── App.jsx             # Routes & layout definition
│   │   ├── index.css           # Tailwind CSS directives & custom utility classes
│   │   └── main.jsx            # Entry point
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Backend Express REST API + Socket.IO
│   ├── src/
│   │   ├── config/             # MongoDB connection & Cloudinary setup
│   │   ├── controllers/        # Auth, Products, Users, Chat, Reports
│   │   ├── middleware/         # Auth, Uploads (Multer), Error handling, Validation
│   │   ├── models/             # User, Product, Conversation, Message, Report
│   │   ├── routes/             # REST endpoint routers
│   │   ├── sockets/            # Socket.IO connection & event handlers
│   │   ├── utils/              # Token helpers & seed datasets
│   │   ├── scripts/            # Database seed script
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server bootstrap & port listener
│   ├── tests/                  # 20+ automated integration tests
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package scripts
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies

From the project root:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

#### Backend (`backend/.env`):
Create `backend/.env` by copying `backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/reloop
JWT_SECRET=reloop_super_secret_jwt_key_2026_dev
JWT_EXPIRES_IN=7d

# Optional Cloudinary Credentials (if left empty, local uploads in /uploads are used automatically)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
> **Note**: If you do not have MongoDB running locally, the server will automatically launch an embedded **in-memory MongoDB instance** so you can develop and test with zero configuration!

#### Frontend (`frontend/.env`):
Create `frontend/.env` by copying `frontend/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Sample Database

Populate realistic pre-owned products across all 10 categories, demo users, mutual favorites, and a sample chat:

```bash
cd backend
npm run seed
```

**Pre-configured Demo Accounts (Password for all: `password123`):**
- **Aarav Sharma**: `aarav@example.com` (Buyer)
- **Priya Patel**: `priya@example.com` (Seller)
- **Rohan Mehta**: `rohan@example.com`
- **Ananya Iyer**: `ananya@example.com`

### 4. Run the Application

In one terminal, start the backend:
```bash
cd backend
npm run dev
# Backend running at http://localhost:5000
```

In a second terminal, start the frontend:
```bash
cd frontend
npm run dev
# Frontend running at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

ReLoop comes with a comprehensive backend integration test suite covering 20 key scenarios including:
- User registration, duplicate email handling, and password encryption
- Protected route authorization
- Product creation, validation, search, and category filtering
- Unauthorized edits/deletions being rejected (403 Forbidden)
- Favorites toggle persistence
- Self-messaging prevention and buyer-seller chat authorization
- Report submissions and soft/hard deletion

To run the test suite:

```bash
cd backend
npm test
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Create account (returns JWT token & HttpOnly cookie)
- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Clear session
- `GET /api/auth/me` — Retrieve current authenticated user [Protected]

### Products
- `GET /api/products` — Filter listings (`search`, `category`, `condition`, `minPrice`, `maxPrice`, `city`, `sort`, `page`, `limit`)
- `GET /api/products/:id` — Get product detail (increments view count and returns similar items)
- `POST /api/products` — Post listing with multipart images [Protected]
- `PATCH /api/products/:id` — Update listing details [Owner Only]
- `DELETE /api/products/:id` — Delete listing and clean assets [Owner Only]
- `PATCH /api/products/:id/status` — Change status (`active`, `reserved`, `sold`) [Owner Only]

### Users & Favorites
- `GET /api/users/:id` — Public profile and active listings
- `PATCH /api/users/me` — Update name, phone, city, avatar [Protected]
- `GET /api/users/me/products` — Retrieve user's own listings [Protected]
- `GET /api/users/me/favorites` — Retrieve favorited products [Protected]
- `POST /api/users/me/favorites/:productId` — Save listing [Protected]
- `DELETE /api/users/me/favorites/:productId` — Remove saved listing [Protected]

### Real-Time Chat
- `GET /api/conversations` — Get user conversations [Protected]
- `POST /api/conversations` — Start or retrieve conversation for product [Protected]
- `GET /api/conversations/:id/messages` — Fetch message history [Participant Only]
- `POST /api/conversations/:id/messages` — Send message and notify recipient [Participant Only]

### Reports & Moderation
- `POST /api/reports` — Submit listing report with reason [Protected]

---

## ☁️ Deployment Guide

### 1. MongoDB Atlas (Database)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a user with read/write privileges.
4. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/reloop?retryWrites=true&w=majority`.

### 2. Cloudinary (Media Storage)
1. Sign up on [Cloudinary](https://cloudinary.com/).
2. From the dashboard, copy:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 3. Deploy Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com/) pointing to your GitHub repository.
2. Root Directory: `backend`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `MONGODB_URI=<your-atlas-uri>`
   - `JWT_SECRET=<strong-random-secret>`
   - `CLOUDINARY_CLOUD_NAME=<your-cloud-name>`
   - `CLOUDINARY_API_KEY=<your-api-key>`
   - `CLOUDINARY_API_SECRET=<your-api-secret>`

### 4. Deploy Frontend (Vercel)
1. Import repository into [Vercel](https://vercel.com/).
2. Root Directory: `frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variables:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-render-backend.onrender.com`
5. Deploy.

---

## 📄 License
MIT © 2026 ReLoop Technologies Inc.
