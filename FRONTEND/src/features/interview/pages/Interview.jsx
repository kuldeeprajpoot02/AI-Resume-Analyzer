
import "../style/interview.scss";
import { useEffect, useState } from "react";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router-dom";

const Interview = () => {
    const { report, loading, getReportById } = useInterview();
    const { interviewId } = useParams();
    const [activeSection, setActiveSection] = useState("technical");

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId).catch((error) => {
                console.error("Failed to load report:", error);
            });
        }
    }, [interviewId]);

    const handleDownloadPDF = () => {
        window.print();
    };

    if (loading) {
        return (
            <main className="report-page">
                <section className="report-container">
                    <div className="loading">
                        <h2>Loading Interview Report...</h2>
                        <p>Please wait while we fetch your report.</p>
                    </div>
                </section>
            </main>
        );
    }

    if (!report) {
        return (
            <main className="report-page">
                <section className="report-container">
                    <div className="loading">
                        <h2>No Interview Report Found</h2>
                        <p>Generate an interview report first.</p>
                    </div>
                </section>
            </main>
        );
    }

    const questions =
        activeSection === "technical"
            ? report.technicalQuestions
            : report.behavioralQuestions;

    return (
        <main className="report-page">
            <section className="report-container">
                <aside className="sidebar-left no-print">
                    <h3>{report.title || "Interview Report"}</h3>

                    <button
                        className={`menu-item ${activeSection === "technical" ? "active" : ""}`}
                        onClick={() => setActiveSection("technical")}
                    >
                        Technical Questions
                    </button>

                    <button
                        className={`menu-item ${activeSection === "behavioral" ? "active" : ""}`}
                        onClick={() => setActiveSection("behavioral")}
                    >
                        Behavioral Questions
                    </button>

                    <button
                        className={`menu-item ${activeSection === "roadmap" ? "active" : ""}`}
                        onClick={() => setActiveSection("roadmap")}
                    >
                        Roadmap
                    </button>

                    <div className="sidebar-footer">
                        <button
                            className="download-btn"
                            onClick={handleDownloadPDF}
                            type="button"
                        >
                            Download PDF
                        </button>
                    </div>
                </aside>

                <section className="report-content">
                    <div className="content-header">
                        <h2>
                            {activeSection === "technical" && "Technical Questions"}
                            {activeSection === "behavioral" && "Behavioral Questions"}
                            {activeSection === "roadmap" && "Preparation Roadmap"}
                        </h2>
                    </div>

                    <div className="content-body">
                        {(activeSection === "technical" ||
                            activeSection === "behavioral") && (
                            <>
                                {questions?.length > 0 ? (
                                    questions.map((question, index) => (
                                        <div className="question-card" key={question._id || index}>
                                            <h4>
                                                {index + 1}. {question.question}
                                            </h4>
                                            <p>
                                                <strong>Intention:</strong>{" "}
                                                {question.intention || "Not provided"}
                                            </p>
                                            <p>
                                                <strong>Answer:</strong>{" "}
                                                {question.answer ||
                                                    question.expectedAnswer ||
                                                    "No answer provided."}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No questions found.</p>
                                )}
                            </>
                        )}

                        {activeSection === "roadmap" && (
                            <>
                                {report.preparationPlan?.length > 0 ? (
                                    report.preparationPlan.map((plan, index) => (
                                        <div className="question-card" key={plan._id || index}>
                                            <h4>Day {plan.day}</h4>

                                            <h5>Focus</h5>
                                            <ul>
                                                {plan.focus?.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>

                                            <h5>Tasks</h5>
                                            <ul>
                                                {plan.task?.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p>No preparation plan found.</p>
                                )}
                            </>
                        )}
                    </div>
                </section>

                <aside className="sidebar-right">
                    <div className="score-card">
                        <h3>Match Score</h3>

                        <div className="progress-circle">
                            <svg viewBox="0 0 120 120">
                                <circle className="bg" cx="60" cy="60" r="52" />
                                <circle
                                    className="progress"
                                    cx="60"
                                    cy="60"
                                    r="52"
                                    style={{
                                        strokeDashoffset:
                                            326.7 -
                                            (326.7 * (report.matchScore || 0)) / 100,
                                    }}
                                />
                            </svg>

                            <div className="score-text">
                                {report.matchScore || 0}%
                            </div>
                        </div>

                        <p>
                            {report.matchScore >= 80
                                ? "Strong Profile Match"
                                : report.matchScore >= 60
                                ? "Good Profile Match"
                                : "Profile Needs Improvement"}
                        </p>
                    </div>

                    <div className="skill-section">
                        <h3>Skill Gaps</h3>

                        <div className="skills">
                            {report.skillGaps?.length > 0 ? (
                                report.skillGaps.map((skill, index) => (
                                    <span key={skill._id || index}>
                                        {skill.skill || skill.name || skill}
                                    </span>
                                ))
                            ) : (
                                <p>No skill gaps found.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
};

export default Interview;
