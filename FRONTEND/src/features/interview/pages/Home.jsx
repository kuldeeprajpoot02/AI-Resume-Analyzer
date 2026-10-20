
import { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading: reportLoading, generateReport } = useInterview();
  const { user, handleLogout } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    const resumeFile = resumeInputRef.current?.files?.[0];

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    if (!resumeFile) {
      alert("Please upload your resume PDF.");
      return;
    }

    if (
      resumeFile.type !== "application/pdf" &&
      !resumeFile.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please select a valid PDF file.");
      return;
    }

    if (resumeFile.size > 3 * 1024 * 1024) {
      alert("PDF size must be less than 3 MB.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      } else {
        alert("Report generate nahi hui. Dobara try karein.");
      }
    } catch (error) {
      console.error("Generate report error:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Report generate nahi hui. Dobara try karein."
      );
    }
  };

  const handleLogoutClick = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    setLogoutLoading(true);

    try {
      await handleLogout();
      navigate("/login", { replace: true });
    } finally {
      setLogoutLoading(false);
    }
  };

  const navigateTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <main className={`home-app ${darkMode ? "dark-mode" : ""}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">AI</div>
          <div>
            <h2>ResumeAI</h2>
            <span>Career Assistant</span>
          </div>
        </div>

        <p className="sidebar-section-label">WORKSPACE</p>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <button
            type="button"
            className="sidebar-link active"
            onClick={() => navigateTo("/")}
          >
            <span>⌂</span> Home
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navigateTo("/history")}
          >
            <span>▤</span> My Reports
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navigateTo("/profile")}
          >
            <span>♙</span> My Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-link theme-sidebar-button"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            <span>{darkMode ? "☀" : "☾"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="sidebar-user">
            <div className="user-avatar">
              {(user?.username || "U").charAt(0).toUpperCase()}
            </div>

            <div className="sidebar-user-info">
              <strong>{user?.username || "User"}</strong>
              <small>{user?.email || "Signed in"}</small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-link logout-link"
            onClick={handleLogoutClick}
            disabled={logoutLoading}
          >
            <span>↪</span>
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      <section className="home-main">
        <header className="home-topbar">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open navigation menu"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div>
            <span className="topbar-eyebrow">YOUR CAREER WORKSPACE</span>
            <h2>Welcome{user?.username ? `, ${user.username}` : ""}!</h2>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            AI Workspace
          </div>
        </header>

        <div className="home-content">
          <section className="welcome-banner">
            <div className="welcome-banner-content">
              <span className="banner-label">AI-POWERED CAREER TOOL</span>
              <h1>Prepare smarter. Interview better.</h1>
              <p>
                Analyze your resume against a job description and prepare
                for your next career opportunity.
              </p>
            </div>

            <div className="welcome-banner-icon" aria-hidden="true">
              ✦
            </div>
          </section>

          <div className="section-heading">
            <div>
              <h2>Create Interview Report</h2>
              <p>Share the job details and upload your resume to get started.</p>
            </div>
            <span className="step-indicator">STEP 01</span>
          </div>

          <form className="interview-input-group" onSubmit={handleGenerateReport}>
            <div className="left">
              <label htmlFor="jobDescription">
                Job Description <span className="required-mark">*</span>
              </label>

              <p className="field-description">
                Paste the job description for the role you want to apply for.
              </p>

              <textarea
                name="jobDescription"
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter the job title, required skills, responsibilities..."
                required
              />
            </div>

            <div className="right">
              <div className="input-group">
                <label htmlFor="resume">
                  Upload Resume <span className="required-mark">*</span>
                </label>

                <p className="field-description">
                  PDF format only, maximum file size 3 MB.
                </p>

                <label className="file-label" htmlFor="resume">
                  <span className="upload-icon">↑</span>
                  <span>Choose your resume PDF</span>
                </label>

                <input
                  ref={resumeInputRef}
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,application/pdf"
                  onChange={(e) =>
                    setSelectedFileName(e.target.files?.[0]?.name || "")
                  }
                />

                <div className="selected-file">
                  <span>PDF</span>
                  <small>
                    {selectedFileName || "No file selected"}
                  </small>
                </div>
              </div>

              <div className="input-group self-description-group">
                <label htmlFor="selfDescription">
                  About You <span className="optional-label">(Optional)</span>
                </label>

                <p className="field-description">
                  Mention your skills, experience, projects, or career goals.
                </p>

                <textarea
                  name="selfDescription"
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

              <button
                type="submit"
                className="button primary-button generate-report-button"
                disabled={reportLoading}
              >
                {reportLoading
                  ? "Generating Report..."
                  : "✦ Generate Interview Report"}
              </button>
            </div>
          </form>

          <p className="home-footer-note">
            Your next opportunity starts with better preparation.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;