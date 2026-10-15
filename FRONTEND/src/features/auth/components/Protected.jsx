
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main className="auth-loading">
                <h2>Loading...</h2>
                <p>Please wait while we verify your session.</p>
            </main>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
};

export default Protected;