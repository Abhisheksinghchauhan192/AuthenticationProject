import mysql from 'mysql2/promise'
import 'dotenv/config'

// --- Database Configuration ---
const dbConfig = {
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
};
const DB_NAME = process.env.DB_NAME;


async function createDatabase() {
    let connection;
    try {
        // Connect to MySQL server without specifying a database
        connection = await mysql.createConnection(dbConfig);
        
        // Sanitize the database name to prevent SQL injection 
        const sanitizedDbName = DB_NAME.replace(/`/g, '');
        
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${sanitizedDbName}\``);
        console.log(`[OK] Database '${DB_NAME}' created or already exists.`);
    } finally {
        if (connection) await connection.end();
    }
}

// creating tables in the dataBase. 

async function createTables() {
    let connection;
    try {
        // Now, connect to the specific database to create tables
        connection = await mysql.createConnection({
            ...dbConfig,
            database: DB_NAME,
        });

        console.log(`[INFO] Connected to database '${DB_NAME}'. Creating tables...`);

        // --- Create 'auth_user' Table ---
        const createAuthUserTableSQL = `
        CREATE TABLE IF NOT EXISTS auth_user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        );`;
        await connection.execute(createAuthUserTableSQL);
        console.log("[OK] Table 'auth_user' created or already exists.");

        // --- Create 'teachers' Table ---
        const createTeachersTableSQL = `
        CREATE TABLE IF NOT EXISTS teachers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            university_name VARCHAR(255) NOT NULL,
            gender ENUM('Male', 'Female', 'Other') NOT NULL,
            year_joined YEAR NOT NULL,
            department VARCHAR(100),
            date_of_birth DATE,
            CONSTRAINT fk_user_id
                FOREIGN KEY (user_id) REFERENCES auth_user(id)
                ON DELETE CASCADE
        );`;
        await connection.execute(createTeachersTableSQL);
        console.log("[OK] Table 'teachers' created or already exists.");

    } finally {
        if (connection) await connection.end();
    }
}


// creating main function to initialize the database. 

async function initializeDatabase() {
    try {
        console.log("--- Starting Database Initialization ---");
        await createDatabase();
        await createTables();
        console.log("--- Database Initialization Complete ---");
    } catch (error) {
        console.error("[FATAL] Database initialization failed:", error);
        process.exit(1); // Exit with error code
    }
}

// initialization
initializeDatabase();