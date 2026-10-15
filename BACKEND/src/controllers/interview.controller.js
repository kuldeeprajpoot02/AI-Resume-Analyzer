
const pdfParse = require("pdf-parse");

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.services");

const interviewReportModel =
    require("../models/interviewReport.model");


/**
 * Generate interview report
 * POST /api/interview
 */
async function generateInterviewReportController(req, res) {
    try {
        console.log("INTERVIEW API HIT");

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF file is required."
            });
        }

        console.log("PDF RECEIVED:", req.file.originalname);
        console.log("PDF SIZE:", req.file.size);

        const pdfData = await pdfParse(req.file.buffer);
        const resumeContent = pdfData.text;

        if (!resumeContent || !resumeContent.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "PDF se text read nahi ho paya. Text-selectable PDF upload karein."
            });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                success: false,
                message: "Job description is required."
            });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription
        });

        if (
            !interviewReportByAi ||
            typeof interviewReportByAi !== "object"
        ) {
            throw new Error("AI returned an invalid interview report.");
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            success: true,
            message: "Interview Report Generated Successfully",
            interviewReport
        });

    } catch (error) {
        console.error(
            "Generate Interview Report Error:",
            error?.stack || error?.message || error
        );

        const errorMessage = String(error?.message || "");

        const isGeminiUnavailable =
            /503|UNAVAILABLE|high demand|temporarily busy|overloaded/i
                .test(errorMessage);

        if (isGeminiUnavailable) {
            return res.status(503).json({
                success: false,
                message:
                    "AI service is temporarily unavailable. Please try again later."
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while generating the interview report.",
            error: errorMessage
        });
    }
}


/**
 * Get interview report by ID
 * GET /api/interview/:interviewId
 */
async function generateInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview Report Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interview Report Fetched Successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Get Interview Report Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while fetching the interview report."
        });
    }
}


/**
 * Get all reports of logged-in user
 * GET /api/interview
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v");

        return res.status(200).json({
            success: true,
            message: "Interview reports fetched successfully",
            interviewReports
        });

    } catch (error) {
        console.error("Get All Interview Reports Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while fetching interview reports."
        });
    }
}


/**
 * Delete interview report
 * DELETE /api/interview/:interviewId
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;

        const deletedReport = await interviewReportModel.findOneAndDelete({
            _id: interviewId,
            user: req.user.id
        });

        if (!deletedReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interview report deleted successfully."
        });

    } catch (error) {
        console.error("Delete Interview Report Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid interview report ID."
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while deleting the report."
        });
    }
}


/**
 * Generate resume PDF
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport =
            await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const { resume, jobDescription, selfDescription } =
            interviewReport;

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Generate Resume PDF Error:", error);

        return res.status(500).json({
            success: false,
            message: "Resume PDF generate nahi ho payi."
        });
    }
}


module.exports = {
    generateInterviewReportController,
    generateInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    deleteInterviewReportController
};
