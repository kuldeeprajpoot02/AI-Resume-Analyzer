
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">AI</span>
              <span className="footer-logo-text">
                <strong>ResumeAI</strong>
                <small>Career Assistant</small>
              </span>
            </Link>

            <p className="footer-description">
              Build a stronger resume, improve your interview
              preparation, and move confidently toward your
              career goals with AI.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-navigation">
            <h3>Quick Links</h3>
            <nav aria-label="Footer navigation">
              <Link to="/">Home</Link>
              <Link to="/history">My Reports</Link>
              <Link to="/profile">My Profile</Link>
            </nav>
          </div>

          {/* Product information */}
          <div className="footer-information">
            <h3>Your Next Opportunity</h3>
            <p>
              Prepare smarter. Present your skills better.
              Take the next step in your career.
            </p>
            <Link to="/" className="footer-cta">
              Get Started <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} AI Resume Analyzer.
            All rights reserved.
          </p>

          <span className="footer-tagline">
            Built for your career journey
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
