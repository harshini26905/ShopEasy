# ShopEasy — E-Commerce Web Application

A full-stack online store with a product catalog, cart, checkout, order tracking,
JWT authentication, and role-based access (Admin/User).

**Stack:** React (Vite + Tailwind) · Node.js/Express · MongoDB (Mongoose) · JWT auth

---

## Features

- **Product catalog** — search, category filter, pagination
- **Cart** — add/update/remove items, persisted in localStorage
- **Checkout** — shipping address form, stock validation, order creation
- **Order tracking** — order history + visual status tracker (pending → processing → shipped → delivered)
- **Auth** — register/login with JWT, passwords hashed with bcrypt
- **Role-based access** — Admin dashboard to manage products (CRUD) and orders (update status); regular users can only shop and track their own orders
- **REST API** — clean Express routes for auth, products, and orders

## Project Structure

```
ecommerce-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Product, Order schemas
│   ├── controllers/              # Route handlers
│   ├── routes/                   # Express routers
│   ├── middleware/                # JWT auth, admin guard, error handler
│   ├── seed.js                   # Sample data loader
│   └── server.js                 # App entry point
└── frontend/
    ├── src/
    │   ├── api/axios.js          # Axios instance w/ JWT interceptor
    │   ├── context/              # AuthContext, CartContext
    │   ├── components/           # Navbar, ProductCard, route guards
    │   └── pages/                # Home, ProductDetail, Cart, Checkout,
    │                             # Login, Register, Orders, OrderDetail,
    │                             # AdminDashboard
    └── ...
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - Local: install MongoDB Community Server and run `mongod`, or
  - Free cloud option: create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and grab the connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce   # or your Atlas connection string
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Load sample data (creates an admin account, a regular user, and 6 sample products):
```bash
node seed.js
```
This prints the demo login credentials:
- Admin → `admin@example.com` / `admin123`
- User → `user@example.com` / `user1234`

Start the API server:
```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start
```
The API runs at `http://localhost:5000/api`. Check it with `GET /api/health`.

### 2. Frontend

In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm run dev
```
The app runs at `http://localhost:5173`.

## API Overview

| Method | Route                        | Access        | Description                     |
|--------|-------------------------------|---------------|----------------------------------|
| POST   | /api/auth/register             | Public        | Create account                   |
| POST   | /api/auth/login                | Public        | Log in, get JWT                  |
| GET    | /api/auth/profile               | Logged in     | Get current user                 |
| GET    | /api/products                  | Public        | List products (search/filter/page)|
| GET    | /api/products/:id                | Public        | Product detail                   |
| GET    | /api/products/categories/list      | Public        | Distinct categories               |
| POST   | /api/products                  | Admin         | Create product                   |
| PUT    | /api/products/:id                | Admin         | Update product                   |
| DELETE | /api/products/:id                | Admin         | Delete product                   |
| POST   | /api/orders                    | Logged in     | Place order (checkout)            |
| GET    | /api/orders/my                  | Logged in     | My order history                  |
| GET    | /api/orders/:id                  | Owner/Admin   | Order detail                      |
| GET    | /api/orders                     | Admin         | All orders                        |
| PUT    | /api/orders/:id/status              | Admin         | Update order status               |

## Notes on how this was built

- Order pricing/stock is always recomputed server-side at checkout (never trusts client-sent prices) to prevent tampering.
- Passwords are hashed with bcrypt before storage; JWTs are used for stateless auth and verified on every protected route.
- The `admin` role can only be granted at signup via a server-side `ADMIN_SIGNUP_SECRET` (optional, unset by default) — normally you'll just seed an admin or manually flip a user's role to `admin` in the database.
- Frontend cart state is kept in localStorage/context; checkout is the only place that talks to the order API.

## Next Steps / Possible Extensions

- Real payment gateway integration (Stripe/Razorpay) instead of the placeholder `card`/`cod` selector
- Product image upload (e.g. Cloudinary/S3) instead of image URLs
- Email notifications on order status changes
- Product reviews & ratings
- Unit/integration tests (Jest + Supertest for backend, React Testing Library for frontend)
