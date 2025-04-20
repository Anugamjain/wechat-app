backend/
│
├── 📁 controllers/        # Handle request logic (e.g., user, auth)
│   └── auth-controller.js
│
├── 📁 services/           # Reusable business logic (e.g., OTP, email)
│   └── otp-service.js
│
├── 📁 models/             # Database models / schemas (e.g., mongoose or sequelize)
│   └── User.js
│
├── 📁 routes/             # Define and group routes
│   └── auth-routes.js
│
├── 📁 config/             # Configuration files (e.g., db.js, constants.js)
│   └── db.js
│
├── 📁 middlewares/        # Express middlewares (e.g., auth, error handling)
│   └── auth-middleware.js
│
├── 📁 utils/              # Utility functions (e.g., validators, helpers)
│   └── sendEmail.js
│
├── 📁 validators/         # Joi or express-validator schemas
│   └── authValidator.js
│
├── 📁 jobs/               # Scheduled jobs or cron scripts
│
├── 📁 logs/               # Log files (can be gitignored)
│
├── .env                   # Environment variables
├── .gitignore             # Ignore node_modules, env, logs, etc.
├── package.json
├── server.js              # Entry point
└── README.md
# wechat-app
