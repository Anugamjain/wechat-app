📁 backend/
│
├── 📁 config/             # Configuration (e.g., env vars, DB, constants)
│   ├── db.js
│   ├── constants.js
│   └── env.js
│
├── 📁 controllers/        # Request handling (thin layer)
│   └── auth.controller.js
│
├── 📁 services/           # Business logic (reusable services)
│   └── otp.service.js
│
├── 📁 models/             # DB models/schemas
│   └── user.model.js
│
├── 📁 routes/             # API routes
│   └── auth.routes.js
│
├── 📁 middlewares/        # Middleware function