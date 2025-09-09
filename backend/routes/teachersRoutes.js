import express from 'express'
import {protect} from '../middleware/authMiddleware.js'
import pool from '../database/dbconnection.js'

const router = express.Router()

// Route to Register the details of a Teacher. 
router.post('/',protect,async (req,res)=>{

    // User Already Exists Varified by json token . 
    // get the data from req body
    const userId = req.user.id
    const {
        universityName,
        yearJoined,
        department,
        dateOfBirth,
        gender
    }=req.body

    if(!universityName || !yearJoined || !department || !gender || !dateOfBirth)
        return res.status(400).json({message:"Missing Details."})

    // Now Check wether the data for the user Already Exists or not.
    const checkUserQuery = ' SELECT id FROM teachers WHERE user_id = ?;'
    let connection
    try{

        connection = await pool.getConnection()
        const [teacherData] = await connection.execute(checkUserQuery,[userId])

        if(teacherData.length)
            return res.status(409).json({message:"Teachers Profile for the user Already Present ."})

        // if not present then we have to insert the data into the database so 

        const newDataInsertQuery = 'INSERT INTO teachers (user_id,university_name,department,year_joined,gender,date_of_birth) VALUES(?,?,?,?,?,?) ;'

        await connection.execute(newDataInsertQuery,[
            userId,universityName,department,yearJoined,gender,dateOfBirth
        ])

        console.log("Teachers Profile Added Succefully.")

        res.status(201).json({message:"Teachers Profile created Successfully."})
    }catch(error){
        console.log("Error Creating Teacher Profile",error)
        return res.status(500).json({message:"Internal Sever Error"})
    }
    finally{
        if(connection)
                connection.release()
    }
})

export default router