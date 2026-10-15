
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import "../style/history.scss";

const History = () => {
    const {
        reports,
        loading,
        getReports,
        deleteReport
    } = useInterview();

    const navigate = useNavigate();

    const [deletingId, setDeletingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getReports().catch((error) => {
            console.error("History load error:", error);
            setErrorMessage(
                "Reports load nahi ho paayi. Please refresh karein."
            );
        });
    }, []);

    const handleDelete = async (interviewId) => {
        const confirmed = window.confirm(
            "Kya aap sach mein ye report delete karna chahte hain? Ye action undo nahi hoga."
        );

        if (!confirmed) return;

        setDeletingId(interviewId);
        setErrorMessage("");

        try {
            await deleteReport(interviewId);
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.message ||
                error?.message ||
                "Report delete nahi ho paayi."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="history-page">
            <header className="history-header">
                <div className="history-heading">
                    <span className="history-eyebrow">
                        YOUR DASHBOARD
                    </span>

                    <h1>My Interview Reports</h1>

                    <p>
                        Apne resume analysis reports dekhein aur
                        manage karein.
                    </p>
                </div>

                <button
                    type="button"
                    className="history-button history-back-button"
                    onClick={() => navigate("/")}
                >
                    <span aria-hidden="true">←</span>
                    Back to Home
                </button>
            </header>

            <section className="history-content">
                <div className="history-section-heading">
                    <div>
                        <h2>Report History</h2>
                        <p>
                            {reports?.length || 0}{" "}
                            {(reports?.length || 0) === 1
                                ? "report"
                                : "reports"}{" "}
                            saved
                        </p>
                    </div>
                </div>

                {errorMessage && (
                    <div
                        className="history-message history-error"
                        role="alert"
                    >
                        <p>{errorMessage}</p>

                        <button
                            type="button"
                            className="history-button"
                            onClick={() => {
                                setErrorMessage("");
                                getReports().catch((error) => {
                                    console.error(
                                        "History reload error:",
                                        error
                                    );
                                    setErrorMessage(
                                        "Reports load nahi ho paayi. Please refresh karein."
                                    );
                                });
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="history-message history-loading">
                        <span
                            className="history-spinner"
                            aria-hidden="true"
                        />
                        <p>Loading your reports...</p>
                    </div>
                )}

                {!loading &&
                    !errorMessage &&
                    (!reports || reports.length === 0) && (
                        <div className="history-empty">
                            <div
                                className="history-empty-icon"
                                aria-hidden="true"
                            >
                                📄
                            </div>

                            <h3>No reports yet</h3>

                            <p>
                                Apna pehla resume analysis report
                                generate karke yahan dekhein.
                            </p>

                            <button
                                type="button"
                                className="history-button history-primary-button"
                                onClick={() => navigate("/")}
                            >
                                Generate First Report
                            </button>
                        </div>
                    )}

                {!loading &&
                    reports?.length > 0 && (
                        <div className="history-report-grid">
                            {reports.map((item) => (
                                <article
                                    className="history-report-card"
                                    key={item._id}
                                >
                                    <div className="history-card-top">
                                        <div className="history-report-icon">
                                            📑
                                        </div>

                                        <span className="history-status">
                                            Analysis Report
                                        </span>
                                    </div>

                                    <h3>
                                        {item.title ||
                                            "Interview Report"}
                                    </h3>

                                    <div className="history-score">
                                        <span className="history-score-label">
                                            Match Score
                                        </span>

                                        <strong>
                                            {item.matchScore != null
                                                ? `${item.matchScore}%`
                                                : "N/A"}
                                        </strong>
                                    </div>

                                    <div className="history-card-actions">
                                        <button
                                            type="button"
                                            className="history-button history-primary-button"
                                            onClick={() =>
                                                navigate(
                                                    `/interview/${item._id}`
                                                )
                                            }
                                        >
                                            View Report
                                            <span aria-hidden="true">
                                                →
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            className="history-button history-delete-button"
                                            onClick={() =>
                                                handleDelete(item._id)
                                            }
                                            disabled={
                                                deletingId === item._id
                                            }
                                        >
                                            {deletingId === item._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
            </section>
        </main>
    );
};

export default History;