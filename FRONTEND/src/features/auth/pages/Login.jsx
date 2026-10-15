
import { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("LOGIN BUTTON CLICKED");

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            console.log("Sending login request...");

            const success = await handleLogin({
                email: email.trim(),
                password,
            });

            console.log("Login result:", success);

            if (success) {
                navigate("/");
            } else {
                setError(
                    "Login failed. Please check your email and password."
                );
            }
        } catch (err) {
            console.error("Login error:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to login. Please try again."
            );
        }
    };

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            style={{
                                color: "red",
                                marginTop: "10px",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;