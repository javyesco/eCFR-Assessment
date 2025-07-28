import app from "./routes.js";
import dotenv from "dotenv";
import { createPool } from "mysql2/promise";

import EcfrDAO from "./DAO/EcfrDAO.js";

let pool;

// Create DB Pool
async function injectDB() {
    if (!pool) {
        try {
            pool = createPool({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
            });
            console.log("MySQL connection pool created successfully.");
        } catch (error) {
            console.error("Error creating MySQL connection pool:", error);
            throw error;
        }
    }
}

// Validate Environment variables exists
function validateEnv() {
    const required = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
    for (const key of required) {
        if (!process.env[key]) {
            throw new Error(`Missing required env variable: ${key}`);
        }
    }
}

// Start application
async function main() {
    // Load environment variables from .env
    dotenv.config();

    // Determine the port
    const envPort = parseInt(process.env.PORT || "6000", 10);
    const port = isNaN(envPort) ? 6000 : envPort;

    try {
        // Validate critical env vars before starting your app
        validateEnv();

        // Initialize the MySQL connection pool
        await injectDB();

        // Pass connection to other methods
        await EcfrDAO.injectDB(pool);

        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is live on http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error establishing connection:", err);
        process.exit(1); // Exit the process if the DB connection fails
    }
}

// Export the pool for use in other modules
export { pool };

// Call main function to start the server
main().catch(console.error);
