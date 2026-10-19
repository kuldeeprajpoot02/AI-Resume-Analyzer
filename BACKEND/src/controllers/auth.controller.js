
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
};

/**
 * POST /api/auth/register
 * Register a new user
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Please provide valid information"
            });
        }

        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await userModel.findOne({
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Account already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
}

/**
 * POST /api/auth/login
 * Login a user
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Temporary diagnostic logs; never log passwords or hashes.
        console.log("Login email received:", normalizedEmail);
        console.log("Database:", userModel.db.name);
        console.log("Collection:", userModel.collection.name);

        const user = await userModel.findOne({
            email: normalizedEmail
        });

        console.log("User found:", Boolean(user));

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password matched:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User login successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
}

/**
 * GET /api/auth/logout
 * Logout and blacklist the token
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token;

        if (token) {
            const existingToken = await tokenBlacklistModel.findOne({
                token
            });

            if (!existingToken) {
                await tokenBlacklistModel.create({ token });
            }
        }

        res.clearCookie("token", cookieOptions);

        return res.status(200).json({
            message: "User logout successfully"
        });
    } catch (error) {
        console.error("Logout error:", error.message);

        return res.status(500).json({
            message: "Logout failed. Please try again."
        });
    }
}

/**
 * GET /api/auth/get-me
 * Get the currently logged-in user
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Get user error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch user"
        });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};
