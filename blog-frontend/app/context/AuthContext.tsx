"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";

type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    name_changed_at?: string | null;
};

type AuthContextType = {
    user: User | null;
    token: string | null;

    login: (
        token: string,
        user: User
    ) => void;

    logout: () => void;

    updateUser: (
        user: User
    ) => void;

    isAuthenticated: boolean;
};

const AuthContext =
    createContext<AuthContextType | null>(
        null
    );

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [user, setUser] =
        useState<User | null>(null);

    const [token, setToken] =
        useState<string | null>(null);

    useEffect(() => {

        const storedToken =
            localStorage.getItem("token");

        const storedUser =
            localStorage.getItem("user");

        if (
            storedToken &&
            storedUser
        ) {
            setToken(storedToken);

            setUser(
                JSON.parse(storedUser)
            );
        }

    }, []);

    // =========================
    // LOGIN
    // =========================

    const login = useCallback(
        (
            newToken: string,
            newUser: User
        ) => {

            localStorage.setItem(
                "token",
                newToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(newUser)
            );

            setToken(newToken);
            setUser(newUser);

        },
        []
    );

    // =========================
    // LOGOUT
    // =========================

    const logout = useCallback(() => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setToken(null);
        setUser(null);

    }, []);

    // =========================
    // UPDATE USER
    // =========================

    const updateUser = useCallback(
        (
            updatedUser: User
        ) => {

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            setUser(updatedUser);

        },
        []
    );

    // =========================
    // MEMOIZED CONTEXT VALUE
    // =========================

    const contextValue = useMemo(
        () => ({
            user,
            token,
            login,
            logout,
            updateUser,
            isAuthenticated:
                !!token,
        }),
        [
            user,
            token,
            login,
            logout,
            updateUser,
        ]
    );

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth debe usarse dentro de AuthProvider"
        );
    }

    return context;
}