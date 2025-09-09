import mysql from 'mysql2/promise'
import 'dotenv/config'



console.log("[DB] Initializing database connection pool...");

// console.log(`Resolved Path: ${module.filename}`);

const dbpool = mysql.createPool(
    {
        user:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        host:process.env.DB_HOSTNAME,
        waitForConnections:true,
        connectionLimit:10,
        queueLimit:0
    }
)


console.log("[DB] Initialised Succefully ...");

// exporting for to be used in the api 

export default dbpool