
import "./Footer.css";

function Footer() {
  return (
    <footer
      style={{
        background: "#0b1220",
        color: "white",
        padding: "30px",
        textAlign: "center",
        marginTop: "40px",
      }}
    >
      <h2>AI Resume Analyzer</h2>
      <p>Build a stronger resume. Move your career forward.</p>
      <p>© {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
