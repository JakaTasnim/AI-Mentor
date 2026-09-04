"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { apiRequest } from "@/lib/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await apiRequest(
                "/users/current-user"
            );

            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await apiRequest(
            "/users/login",
            {
                method: "POST",
                body: JSON.stringify(credentials)
            }
        );

        setUser(response.data.user);

        return response;
    };

    const logout = async () => {
        await apiRequest(
            "/users/logout",
            {
                method: "POST"
            }
        );

        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

export {
    AuthProvider,
    useAuth
};