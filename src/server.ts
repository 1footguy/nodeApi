import app from "./app"
import sequelize from "./config/database"
import { Sequelize } from "sequelize"
import { dbConfig } from "./config/dbConfig"

async function createDatabaseIfNotExists() {
    const tempConnection = new Sequelize(
        "",
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            dialect: dbConfig.dialect,
            logging: false
        }
    );

    try {
        await tempConnection.authenticate();
        await tempConnection.query(`DROP DATABASE ${dbConfig.database}`)
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);
        console.log(`Database "${dbConfig.database}" ready.`);
    } finally {
        await tempConnection.close();
    }
}

async function startServer() {
    try {
        // 1. Criar banco se não existir
        await createDatabaseIfNotExists();

        // 2. Conectar ao banco específico
        await sequelize.authenticate();
        console.log("Connected to database successfully.");

        // 3. Sincronizar modelos
        await sequelize.sync();
        console.log("Database synchronized.");

        // 4. Iniciar servidor
        app.listen(3000, () => console.log("Server running on port 3000"));
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();