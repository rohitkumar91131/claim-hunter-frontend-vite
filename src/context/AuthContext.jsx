import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                // Not logged in or session expired
                console.log("No active session:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (credentials) => {
        await loginUser(credentials);
        // After successful login, fetch user details
        const userData = await getCurrentUser();
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        await registerUser(userData);
        // Depending on backend, register might auto-login or require login.
        // Assuming typical flow where we might need to login or are auto-logged in.
        // If backend sets cookie on register, we can fetch user.
        // If not, we might redirect to login.
        // Let's assume we can fetch user immediately if cookie is set, or just return success.

        // For now, let's try to get user to see if we are logged in
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch (e) {
            // Not logged in automatically
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
