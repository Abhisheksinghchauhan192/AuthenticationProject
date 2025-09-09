import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
// database 
import pool from './database/dbconnection.js'


// Routes 
import homeRoute  from './routes/homeRoute.js';
import loginRoute from './routes/authRoute.js'
import teacherRoute from './routes/teachersRoutes.js'


const app = express()
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        error: "Too many login attempts",
        message: "Please try again after 15 minutes",
        retryAfter: 15 * 60 // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    
    // ✅ Custom handler for better logging
    handler: (req, res) => {
        console.log(`🚫 Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: "Too many login attempts",
            message: "Please try again after 15 minutes"
        });
    },
    
    // ✅ Skip successful requests (don't count them against limit)
    skipSuccessfulRequests: true,
    
});


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/login',loginLimiter);

app.use(cookieParser())
app.use(express.json())
// User's routes. 
app.use('/api', loginRoute);
app.use('/teacher',teacherRoute);
app.use('/', homeRoute);

// Catch all unmatched routes....
app.use((req, res) => {
    
    return res.status(404).send("Page Not Found");
});

const PORT = process.env.PORT || 8080;


const startServer = async () => {
    try {
       
        await pool.query('SELECT 1');
        console.log('[DB] Database connection verified successfully.');

        app.listen(PORT, () => {
            console.log(`Server Started listening on ... PORT - ${PORT}`);
        });

    } catch (error) {

        console.error('[FATAL] Failed to connect to the database. Server will not start.');
        console.error(error);
        process.exit(1); 
    }
};

startServer();
