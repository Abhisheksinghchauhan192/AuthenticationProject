import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkAuthStatus } from '../api/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    login: (userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await checkAuthStatus();
                if (result.success) {
                    setIsAuthenticated(true);
                    setUser(result.data.user);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData: any) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};