
const express = require("express");

let puppeteer;

async function getPuppeteer() {
    if (!puppeteer) {
        const module = await import("puppeteer");
        puppeteer = module.default || module;
    }
    return puppeteer;
}

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();


// Generate interview report
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);


// Get all reports of logged-in user
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);


// Test PDF
interviewRouter.get("/test-pdf", async (req, res) => {
    try {
        const puppeteerModule = await getPuppeteer();

        const browser = await puppeteerModule.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.setContent(`
            <html>
                <body>
                    <h1>PDF Test Successful</h1>
                    <p>Puppeteer is working.</p>
                </body>
            </html>
        `);

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        return res.send(pdf);

    } catch (error) {
        console.error("Test PDF Error:", error);

        return res.status(500).json({
            success: false,
            message: "PDF test failed."
        });
    }
});


// Test AI
interviewRouter.get("/test-ai", async (req, res) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: "Reply with only: AI working"
        });

        return res.status(200).json({
            success: true,
            message: response.text
        });

    } catch (error) {
        console.error("Test AI Error:", error);

        return res.status(500).json({
            success: false,
            message: "AI test failed."
        });
    }
});


// Generate resume PDF
/*
interviewRouter.get(
    "/resume/pdf/:interviewReportID",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
);
*/


// Delete a report
interviewRouter.delete(
    "/:interviewId",
    authMiddleware.authUser,
    interviewController.deleteInterviewReportController
);


// Get one report by ID
interviewRouter.get(
    "/:interviewId",
    authMiddleware.authUser,
    interviewController.generateInterviewReportByIdController
);


module.exports = interviewRouter;
