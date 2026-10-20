
const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.8-flash";

function getAIClient() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY?.trim();

    if (!apiKey) {
        throw new Error(
            "GOOGLE_GENAI_API_KEY is missing in BACKEND/.env"
        );
    }

    return new GoogleGenAI({ apiKey });
}

const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        title: { type: "STRING" },
        matchScore: { type: "NUMBER" },
        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: {
                        type: "STRING",
                        enum: ["low", "medium", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER" },
                    focus: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    },
                    task: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    }
                },
                required: ["day", "focus", "task"]
            }
        }
    },
    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};

async function generateWithRetry(prompt, config = {}) {
    const ai = getAIClient();
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(
                `[AI] Calling Gemini model: ${MODEL_NAME} (attempt ${attempt + 1})`
            );

            const startTime = Date.now();

            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
                config
            });

            const elapsedSeconds =
                ((Date.now() - startTime) / 1000).toFixed(2);

            console.log(
                `[TIMING] Gemini API: ${elapsedSeconds} seconds`
            );

            if (!response.text) {
                throw new Error("Gemini returned an empty response.");
            }

            return response;
        } catch (error) {
            console.error("Gemini API error:", {
                status: error.status,
                message: error.message
            });

            const message = error.message || "";
            const temporary =
                error.status === 503 ||
                error.status === 429 ||
                message.includes("UNAVAILABLE") ||
                message.includes("high demand") ||
                message.includes("429") ||
                message.includes("503");

            if (!temporary || attempt === maxRetries - 1) {
                throw error;
            }

            const retryDelay = 1000 * Math.pow(2, attempt);

            console.log(
                `[AI] Temporary error. Retrying in ${retryDelay / 1000} seconds...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, retryDelay)
            );
        }
    }

    throw new Error("AI request failed.");
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    if (!resume || !jobDescription?.trim()) {
        throw new Error("Resume text and job description are required.");
    }

    const prompt = `
You are an expert career coach and technical interviewer.

Analyze the candidate's resume against the job description.

RESUME:
${resume}

CANDIDATE DESCRIPTION:
${selfDescription || "Not provided"}

JOB DESCRIPTION:
${jobDescription}

Return a useful and honest report.
- Extract the job title.
- Calculate matchScore from 0 to 100 using evidence in the resume.
- Generate exactly 5 technical questions with answers and intentions.
- Generate exactly 5 behavioral questions with answers and intentions.
- Identify relevant skill gaps and assign low, medium, or high severity.
- Create a 7-day preparation plan.
- Each plan item must include day, focus array, and task array.
- Do not invent qualifications or experience.
`;

    const response = await generateWithRetry(prompt, {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema
    });

    let report;

    try {
        report = JSON.parse(response.text);
    } catch {
        throw new Error("Gemini returned invalid JSON for the interview report.");
    }

    report.matchScore = Math.max(
        0,
        Math.min(100, Number(report.matchScore) || 0)
    );

    return report;
}

async function generatedPdfFromHtml(htmlContent) {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true
        });

        return Buffer.from(pdfBuffer);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {
    if (!resume || !jobDescription?.trim()) {
        throw new Error("Resume text and job description are required.");
    }

    const prompt = `
Create a professional, ATS-friendly resume as a complete HTML document.

CANDIDATE RESUME / DETAILS:
${resume}

ADDITIONAL DESCRIPTION:
${selfDescription || "Not provided"}

TARGET JOB DESCRIPTION:
${jobDescription}

Requirements:
- Use clean, professional styling suitable for A4 printing.
- Use semantic HTML and embedded CSS.
- Keep the content truthful; do not invent degrees, jobs, dates, or skills.
- Tailor wording to the target job where supported by the provided details.
- Return JSON only in the form {"html":"complete HTML document"}.
`;

    const response = await generateWithRetry(prompt, {
        responseMimeType: "application/json",
        responseSchema: {
            type: "OBJECT",
            properties: {
                html: { type: "STRING" }
            },
            required: ["html"]
        }
    });

    let result;

    try {
        result = JSON.parse(response.text);
    } catch {
        throw new Error("Gemini returned invalid JSON for the resume.");
    }

    if (
        typeof result.html !== "string" ||
        !result.html.toLowerCase().includes("<html")
    ) {
        throw new Error("Gemini did not return a valid HTML resume.");
    }

    return generatedPdfFromHtml(result.html);
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
};
