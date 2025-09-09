import express from 'express'
import bcrypt from 'bcrypt'// to incrypt the password before storing to the database.
import pool from '../database/dbconnection.js'
import jwt from 'jsonwebtoken'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Add this helper function at the top of your file
async function getUserById(userId) {
    let connection;
    try {
        // ✅ Validate input
        if (!userId) {
            throw new Error('User ID is required');
        }

        connection = await pool.getConnection();
        const userQuery = `
            SELECT id, email, first_name, last_name 
            FROM auth_user 
            WHERE id = ?
        `;
        const [rows] = await connection.execute(userQuery, [userId]);
        
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        
        return {
            id: rows[0].id,
            email: rows[0].email,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name
        };
    } catch (error) {
        // ✅ Better error logging
        console.error(`Error fetching user with ID ${userId}:`, error.message);
        throw error; // Re-throw to be handled by caller
    } finally {
        if (connection) connection.release();
    }
}



router.post('/signup',async (req,res)=>{
    const {
        firstName,
        lastName,
        email,
        password,
        universityName,
        gender,
        yearJoined,
        department
    } = req.body

    // Basic Server Side Validation of the user inputed Data.
    if (!email || !password || !firstName || !lastName || !universityName || !gender || !yearJoined)
        return res.status(400).json({message:"Please provide all required fields ."})
    if(password.length<8)
        return res.status(400).json({message:"Password must be atlease 8 characters long"})

    // declaring a connection to handle in finally block. 
    let connection
    try{

        connection = await pool.getConnection()
        await connection.beginTransaction()
        console.log("Transaction Started for new user Registration.")
        // has the users password before storing it .
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // first we have to write in the auth_user Table then in teacher. 
        // building auth user query 
        const  authUserq = ` INSERT INTO auth_user (email,first_name,last_name,password)
                            VALUES (?,?,?,?);
        `

        const [userResult] = await connection.execute(authUserq,[email,firstName,lastName,hashedPassword])

        const newUserId = userResult.insertId
        if(!newUserId)
            throw new Error("Failed to create User No , Insert Id Was returned ")

        console.log(`[DB] User created in 'auth_user' with ID: ${newUserId}`)

        // Now Insert into the teachers Table. 

        const teacherQ = `
                        INSERT INTO teachers (user_id,university_name,gender,year_joined,department) 
                        VALUES (?,?,?,?,?);
                        `
        await connection.execute(teacherQ,[newUserId,universityName,gender,yearJoined,department])
        console.log(`[DB] Teacher profile created for user ID: ${newUserId}`)

        //if both transaction were successful then 
        await connection.commit()
        console.log("[DB] Transaction committed successfully.")

        res.status(201).json({
            message:"User registered Successfully",
            userId:newUserId
        })
    }catch(error){

        if(connection){
            await connection.rollback()
            console.error("[DB] Transaction rolled back due to an error.");
        }
        console.error("Error during registration:", error);

        if (error.code === 'ER_DUP_ENTRY')
            return res.status(409).json({message:"An account with the email already Exist"})
        
        // For any Other Error send server error. 
        res.status(500).json({message:"Internal Server Error"})
        
    }finally{
        if(connection)
            connection.release()
    }

})


// Login Route... 
router.post('/login',async (req,res)=>{

    const {email,password} = req.body
    if(!email || !password)
        return res.status(400).json({message:"Credential Not Provided."})  
    const loginQ = ' SELECT email,password,id FROM auth_user WHERE email = ?;'

    let connection
    try{
        connection = await pool.getConnection()
        const [rows] = await connection.execute(loginQ,[email])

        // if the data not found then 
        if(rows.length === 0)
            return res.status(401).json({message:"Invalid Credentials"})

        const user = rows[0]
        const isMatched = await bcrypt.compare(password,user.password)
        
        // if the password not matched then send the error to the client
        if(!isMatched)
                return res.status(401).json({message:"Invalid Credentials"})

        // if the user is matched with the details then sent a JWT token
        const payload = {
            user:{
                id:user.id,
                email:user.email
            }
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )

        res.cookie('authToken',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:'strict',
            maxAge:24*60*60*1000,
            path:'/'
        })

        // send the success message and the token
        res.status(200).json({
            message:"Login Successfull",
        })

    }catch(err){
        console.error("Error During Login Process",err)
        res.status(500).json({message:"Internal Server Error"})
    }
    finally{
        if(connection)
            connection.release()
    }
})

router.post('/logout',protect,(req,res)=>{

    res.clearCookie('authToken',{
        httpOnly:true,
        secure:process.env.NODE_ENV ==='production',
        sameSite:'strict'
    });
    res.status(200).json({message:"Logged our successfully"})
})

router.get('/me', protect, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server Error!" });
    }
});

export default router