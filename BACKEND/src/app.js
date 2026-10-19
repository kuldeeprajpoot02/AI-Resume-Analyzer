
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ai-resume-analyzer-mu-sand.vercel.app"
];

// Middleware
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an Origin header
            // (for example, server-to-server requests)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
        credentials: true
    })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health-check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Resume Analyzer backend is running"
    });
});

// Routers
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

// API routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Not-found handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("API Error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.status
            ? err.message
            : "Internal server error"
    });
});

module.exports = app;
