import express from 'express'
import db from '../database/dbconnection.js' 
import { protect as authenticateToken} from '../middleware/authMiddleware.js'
const router = express.Router()

// Get current user's teacher profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT 
                au.id,
                au.first_name as firstName,
                au.last_name as lastName,
                au.email,
                t.university_name as universityName,
                t.gender,
                t.year_joined as yearJoined,
                t.department,
                t.date_of_birth as dateOfBirth
            FROM auth_user au
            LEFT JOIN teachers t ON au.id = t.user_id
            WHERE au.id = ?
        `;
        
        const [rows] = await db.execute(query, [userId]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }
        
        const profile = rows[0];
        
        res.json({
            success: true,
            data: [
                    {
                        id: profile.id,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        email: profile.email,
                        createdAt: profile.created_at,
                        updatedAt: profile.updated_at,
                        isActive: profile.is_active,
                        universityName: profile.universityName,
                        gender: profile.gender,
                        yearJoined: profile.yearJoined,
                        department: profile.department,
                        dateOfBirth: profile.dateOfBirth
                    }
                ]
        });
        
    } catch (error) {
        console.error('Error fetching teacher profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all teachers (list view)
router.get('/profiles', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                au.id,
                au.first_name as firstName,
                au.last_name as lastName,
                au.email,
                t.university_name as universityName,
                t.gender,
                t.year_joined as yearJoined,
                t.department
            FROM auth_user au
            INNER JOIN teachers t ON au.id = t.user_id
            WHERE au.is_active = TRUE
            ORDER BY au.first_name, au.last_name
        `;
        
        const [rows] = await db.execute(query);
        
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default router