require("dotenv").config({ override: true });

const app = require("./src/app");
const connectToDB = require("./src/config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`AI Resume Analyzer backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();