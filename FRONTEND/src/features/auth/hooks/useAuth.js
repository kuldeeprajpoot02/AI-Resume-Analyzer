
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {
    login,
    register,
    logout,
} from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    const {
        user,
        setUser,
        loading,
        setLoading,
    } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({
                email: email.trim(),
                password,
            });

            if (!data?.user) {
                return false;
            }

            setUser(data.user);
            return true;
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data?.message || error.message
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({
        username,
        email,
        password,
    }) => {
        setLoading(true);

        try {
            const data = await register({
                username: username.trim(),
                email: email.trim(),
                password,
            });

            return Boolean(data?.user);
        } catch (error) {
            console.error(
                "Registration failed:",
                error.response?.data?.message || error.message
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();
        } catch (error) {
            console.error(
                "Logout request failed:",
                error.response?.data?.message || error.message
            );
        } finally {
            // Local session state clear karein.
            setUser(null);
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
    };
};