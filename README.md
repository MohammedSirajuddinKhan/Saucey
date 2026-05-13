# BitMe - Food Delivery Application

A full-stack food delivery application built with **Express.js** and **MongoDB**, featuring an EJS-based frontend with modern UI, role-based access control, and serverless deployment on Vercel.

**🌐 Live Demo**: [https://bite-me-eta.vercel.app/](https://bite-me-eta.vercel.app/)

## 🚀 Features

- **User Management**: Registration, login, profile management with JWT-based authentication
- **Restaurant Browsing**: Browse restaurants, view menus, and filter by cuisine categories
- **Food Ordering**: Add items to cart, apply quantities, and checkout
- **Order Tracking**: View order history and track order status in real-time
- **Admin Dashboard**: Manage restaurants, categories, foods, and order statuses
- **Vendor Portal**: Create and manage restaurants and their menu items
- **Secure Authentication**: JWT tokens stored in signed HttpOnly cookies with server-side verification
- **Role-Based Access Control**: Customer, Vendor, and Admin roles with fine-grained permissions
- **Indian Theming**: Curated Indian restaurants and foods with INR pricing
- **Responsive Design**: Modern Color Hunt palette (#546B41, #99AD7A, #DCCCAC, #FFF8EC)
- **Serverless Ready**: Vercel deployment with connection pooling optimization

## 🛠 Tech Stack

### Backend

- **Express.js** (v5.2.1) - Web framework
- **Mongoose** (v9.6.2) - MongoDB ODM
- **JWT** (jsonwebtoken v9.0.3) - Token-based authentication
- **bcryptjs** (v3.0.3) - Password hashing
- **EJS** (v5.0.2) - Server-side templating

### Frontend

- **EJS Templates** - Server-side rendering
- **HTML/CSS/JavaScript** - Vanilla frontend with no build step
- **Responsive design** with custom CSS grid layout

### Database

- **MongoDB Atlas** - Cloud database with connection pooling

### Deployment

- **Vercel** - Serverless hosting
- **Node 20.x** runtime

## 📋 Prerequisites

- **Node.js** 20.x or higher ([download](https://nodejs.org))
- **npm** (included with Node.js)
- **MongoDB Atlas Account** ([create here](https://www.mongodb.com/cloud/atlas))
  - Create a cluster and get your connection URI
  - Whitelist your IP address (or 0.0.0.0 for development)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MohammedSirajuddinKhan/resfoodapp.git
cd resfoodapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foodapp?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars_recommended

# Port (optional, defaults to 3000)
PORT=3000
```

Replace `<username>`, `<password>`, and the cluster URI with your MongoDB Atlas credentials.

### 4. Seed Demo Data (Optional)

```bash
node data/seedDummyData.js
```

This will populate the database with:

- 6 Indian restaurants
- 12 food categories
- 17 Indian food items
- 5 sample orders
- 3 demo user accounts

### 5. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
resfoodapp/
├── api/
│   └── index.js                 # Vercel serverless entry point
├── config/
│   └── db.js                    # MongoDB connection (cached for serverless)
├── controllers/
│   ├── authController.js        # Auth endpoints (register, login, logout)
│   ├── userController.js        # User CRUD operations
│   ├── restaurantController.js  # Restaurant management
│   ├── categoryController.js    # Category management
│   ├── foodController.js        # Food item management
│   ├── orderController.js       # Order management
│   └── webController.js         # Server-rendered page handlers
├── data/
│   └── seedDummyData.js         # Demo data seeder
├── docs/
│   └── vercel-deployment.md     # Detailed deployment guide
├── middlewares/
│   ├── authMiddleware.js        # JWT verification
│   ├── adminMiddleware.js       # Admin role check
│   └── vendorOrAdminMiddleware.js # Vendor/Admin role check
├── models/
│   ├── userModel.js             # User schema
│   ├── restaurantModel.js       # Restaurant schema
│   ├── categoryModel.js         # Category schema
│   ├── foodModel.js             # Food item schema
│   └── orderModel.js            # Order schema
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── userRoutes.js            # User API routes
│   ├── restaurantRoutes.js      # Restaurant API routes
│   ├── categoryRoutes.js        # Category API routes
│   ├── foodRoutes.js            # Food API routes
│   ├── orderRoutes.js           # Order API routes
│   └── webRoutes.js             # Web page routes
├── views/
│   ├── index.ejs                # Homepage (restaurants & browse)
│   ├── login.ejs                # Login page
│   ├── register.ejs             # Registration page
│   ├── restaurant.ejs           # Restaurant menu detail
│   ├── food.ejs                 # Food item detail
│   ├── checkout.ejs             # Order checkout
│   ├── profile.ejs              # User profile
│   ├── orders.ejs               # Order history
│   ├── order-detail.ejs         # Order tracking
│   ├── admin.ejs                # Admin dashboard
│   └── 404.ejs                  # Not found page
├── public/
│   └── css/
│       └── style.css            # Global styles
├── server.js                    # Express app setup & middleware
├── package.json                 # Project metadata & dependencies
├── vercel.json                  # Vercel build & routing config
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description                  | Auth     |
| ------ | -------------------- | ---------------------------- | -------- |
| POST   | `/api/auth/register` | Create a new user account    | None     |
| POST   | `/api/auth/login`    | Login and receive JWT cookie | None     |
| POST   | `/api/auth/logout`   | Clear authentication cookie  | Required |

### Users

| Method | Endpoint         | Description         | Auth                         |
| ------ | ---------------- | ------------------- | ---------------------------- |
| GET    | `/api/users/:id` | Get user details    | Required                     |
| PUT    | `/api/users/:id` | Update user profile | Required (own user)          |
| DELETE | `/api/users/:id` | Delete user account | Required (own user or Admin) |

### Restaurants

| Method | Endpoint               | Description            | Auth                 |
| ------ | ---------------------- | ---------------------- | -------------------- |
| GET    | `/api/restaurants`     | List all restaurants   | None                 |
| GET    | `/api/restaurants/:id` | Get restaurant details | None                 |
| POST   | `/api/restaurants`     | Create restaurant      | Vendor/Admin         |
| PUT    | `/api/restaurants/:id` | Update restaurant      | Vendor/Admin (owner) |
| DELETE | `/api/restaurants/:id` | Delete restaurant      | Admin                |

### Categories

| Method | Endpoint              | Description          | Auth  |
| ------ | --------------------- | -------------------- | ----- |
| GET    | `/api/categories`     | List all categories  | None  |
| GET    | `/api/categories/:id` | Get category details | None  |
| POST   | `/api/categories`     | Create category      | Admin |
| PUT    | `/api/categories/:id` | Update category      | Admin |
| DELETE | `/api/categories/:id` | Delete category      | Admin |

### Foods

| Method | Endpoint         | Description      | Auth                 |
| ------ | ---------------- | ---------------- | -------------------- |
| GET    | `/api/foods`     | List all foods   | None                 |
| GET    | `/api/foods/:id` | Get food details | None                 |
| POST   | `/api/foods`     | Create food item | Vendor/Admin         |
| PUT    | `/api/foods/:id` | Update food item | Vendor/Admin (owner) |
| DELETE | `/api/foods/:id` | Delete food item | Vendor/Admin (owner) |

### Orders

| Method | Endpoint                 | Description         | Auth                   |
| ------ | ------------------------ | ------------------- | ---------------------- |
| GET    | `/api/orders`            | Get user's orders   | Required               |
| GET    | `/api/orders/:id`        | Get order details   | Required (order owner) |
| POST   | `/api/orders`            | Create new order    | Required               |
| PUT    | `/api/orders/:id/status` | Update order status | Admin                  |

## 💾 Database Schema

### User

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ['customer', 'vendor', 'admin'],
  phone: String,
  address: String,
  createdAt: Date
}
```

### Restaurant

```javascript
{
  name: String (required),
  cuisineType: String,
  owner: ObjectId (references User),
  address: String,
  phone: String,
  deliveryTime: Number (in minutes),
  rating: Number (0-5),
  reviews: Number,
  image: String (URL),
  isActive: Boolean,
  createdAt: Date
}
```

### Category

```javascript
{
  name: String (required, unique),
  description: String,
  restaurant: ObjectId (references Restaurant),
  image: String,
  createdAt: Date
}
```

### Food

```javascript
{
  name: String (required),
  description: String,
  price: Number (in paise, display as INR),
  category: ObjectId (references Category),
  restaurant: ObjectId (references Restaurant),
  image: String,
  isVegetarian: Boolean,
  rating: Number,
  reviews: Number,
  createdAt: Date
}
```

### Order

```javascript
{
  user: ObjectId (references User),
  restaurant: ObjectId (references Restaurant),
  items: [{
    food: ObjectId (references Food),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  deliveryAddress: String,
  status: Enum ['pending', 'confirmed', 'preparing', 'on-the-way', 'delivered', 'cancelled'],
  paymentMethod: String,
  notes: String,
  createdAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Flow

1. **Registration**: User creates account → password hashed with bcryptjs → user saved to DB
2. **Login**: User submits credentials → password verified → JWT created → stored in signed HttpOnly cookie `bitemeToken` → user redirected
3. **Verification**: On each request:
   - `authMiddleware` reads JWT from header, query string, or cookie
   - Token is verified with `JWT_SECRET`
   - User loaded from database and attached to request object
   - Next middleware/controller has access to `req.user`

### Role-Based Access

Three role layers control feature access:

- **`authMiddleware`**: Requires any authenticated user
- **`adminMiddleware`**: Requires admin role
- **`vendorOrAdminMiddleware`**: Requires vendor or admin role

Routes requiring these middleware will return `401 Unauthorized` or `403 Forbidden` if access is denied.

### Server-Side Viewer Resolution

All EJS pages call `resolveViewer()` to load the authenticated user from the cookie:

```javascript
// In webController.js
async function resolveViewer(req) {
  const token = req.cookies?.bitemeToken;
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await User.findById(decoded.userId);
}
```

This ensures the server always knows who is viewing each page.

## 🚀 Deployment

### Quick Start

1. Push your code to GitHub
2. Import repository into Vercel
3. Add environment variables (`MONGODB_URI`, `JWT_SECRET`)
4. Deploy

### Architecture

The app is deployed as a **single serverless function** on Vercel:

- Entry point: `api/index.js` (exports Express app)
- Router: `vercel.json` rewrites all requests to `/api/index.js`
- Database: MongoDB connection cached globally to survive cold starts

### Environment Variables Required

Set these in your Vercel project settings:

```
MONGODB_URI = mongodb+srv://<user>:<pass>@cluster.mongodb.net/foodapp?...
JWT_SECRET = your_secret_key_here_min_32_chars
```

### Common Issues & Solutions

See [**DETAILED DEPLOYMENT GUIDE**](./docs/vercel-deployment.md) for:

- Step-by-step Vercel setup
- Troubleshooting "serverless function crashed" errors
- MongoDB connection issues
- Local verification checklist
- Performance optimization tips

## 📝 Demo Credentials

After running the seed script, use these accounts:

| Email                  | Password      | Role     |
| ---------------------- | ------------- | -------- |
| `admin@biteme.test`    | `admin123`    | Admin    |
| `vendor@biteme.test`   | `vendor123`   | Vendor   |
| `customer@biteme.test` | `customer123` | Customer |

You can also register new accounts through `/register`.

## 🔧 Troubleshooting

### Port Already in Use

If you get "EADDRINUSE" error, the port is already occupied.

**Solution**:

- Change `PORT` in `.env` to an available port (e.g., 3001)
- Or kill the process using port 3000: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)

### MongoDB Connection Failed

**Cause**: Incorrect URI or IP not whitelisted

**Solution**:

- Verify `MONGODB_URI` is correct
- Add your IP to MongoDB Atlas IP Whitelist (or use 0.0.0.0 for development)
- Ensure your internet connection is stable

### Login Not Working / Cookie Not Set

**Cause**: Insecure cookie flag or domain mismatch

**Solution**:

- Cookie is set on successful login; check browser DevTools → Application → Cookies
- On localhost, HttpOnly cookies work fine
- On production, ensure your domain matches your Vercel deployment URL

### "Serverless Function Crashed" on Vercel

See the [**Deployment Troubleshooting Guide**](./docs/vercel-deployment.md#if-you-see-serverless-function-crashed) for detailed crash debugging steps.

## 📦 Seeded Demo Data

The project includes 6 Indian restaurants with realistic food items and categories:

- **Taj Mahal Cuisine** - North Indian specialties
- **Spice Route Kitchen** - Fusion curry house
- **Dhaba Express** - Street food & curries
- **Tandoor House** - Tandoori preparations
- **Paneer Palace** - Vegetarian specialties
- **Biryani House** - Rice dishes

Each with 2-3 categories and multiple food items at INR pricing.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

## 📞 Support

For issues, questions, or feature requests, please open an issue on [GitHub](https://github.com/MohammedSirajuddinKhan/resfoodapp/issues).

---

**Happy ordering! 🍛**
