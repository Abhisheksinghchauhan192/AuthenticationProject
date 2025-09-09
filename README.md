# Teacher Management System

A full-stack web application for managing teacher profiles with authentication and profile management features.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT httpOnly cookies
- **Protected Routes**: Route protection with authentication middleware
- **Teacher Profiles**: View and manage teacher profile information
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Error Handling**: Comprehensive error handling with custom error pages
- **Rate Limiting**: Login attempt rate limiting for security

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication with httpOnly cookies
- **bcrypt** for password hashing
- **express-rate-limit** for rate limiting
- **CORS** enabled

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MySQL** server running
- **Git** for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abhisheksinghchauhan192/AuthenticationProject.git
cd Assignment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

#### Configure Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOSTNAME=localhost
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=teacher_management

# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

#### Database Setup

```bash
# Run database initialization (creates database and tables)
node database/init.js
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

#### Configure Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🚀 Running the Application

### Option 1: Run Both Services Separately

#### Start Backend Server
```bash
# In backend directory
cd backend
npm start
# Server will run on http://localhost:8080
```

#### Start Frontend Development Server
```bash
# In client directory (new terminal)
cd client
npm run dev
# Client will run on http://localhost:5173
```

### Option 2: Run with Development Scripts (if configured)

```bash
# From project root (if you have concurrently configured)
npm run dev
```

## 📁 Project Structure

```
Assignment/
├── backend/
│   ├── database/
│   │   ├── dbconnection.js     # Database connection configuration
│   │   └── init.js             # Database initialization script
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoute.js        # Authentication routes
│   │   ├── homeRoute.js        # Profile routes
│   │   └── teachersRoutes.js   # Teacher-specific routes
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server file
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts         # Authentication API calls
│   │   │   └── user.ts         # User/profile API calls
│   │   ├── components/
│   │   │   ├── FormInput.tsx   # Reusable form input component
│   │   │   ├── Header.tsx      # Application header
│   │   │   ├── Layout.tsx      # Main layout component
│   │   │   └── ProtectedRoute.tsx # Route protection component
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── pages/
│   │   │   ├── ErrorPage.tsx   # Error page component
│   │   │   ├── Homepage.tsx    # Main dashboard page
│   │   │   ├── Login.tsx       # Login page
│   │   │   └── Register.tsx    # Registration page
│   │   ├── routes/
│   │   │   └── routes.tsx      # React Router configuration
│   │   └── App.tsx
│   ├── .env                    # Environment variables
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api`)
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user info

### Profile Routes (`/`)
- `GET /profile` - Get current user profile
- `GET /profiles` - Get all teacher profiles

## 🌐 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 📝 Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Dashboard**: View teacher profiles at `/` (protected route)
4. **Logout**: Use the logout button in the header

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Make sure MySQL is running
sudo systemctl start mysql

# Check if database exists
mysql -u root -p
SHOW DATABASES;
```

**Port Already in Use**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**CORS Issues**
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that both servers are running on specified ports

**Authentication Issues**
- Clear browser cookies and localStorage
- Ensure JWT_SECRET is set in backend `.env`
- Check that cookies are being sent with requests

## 🔒 Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on login attempts
- CORS configuration
- Protected routes with authentication middleware

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Update CORS configuration for production domain
3. Use PM2 or similar for process management

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update `VITE_API_BASE_URL` to production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please create an issue in the repository or contact the development team.
