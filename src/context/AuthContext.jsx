import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('glowr_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('glowr_lang') || 'en';
    });

    const toggleLanguage = () => {
        const nextLang = language === 'en' ? 'hi' : 'en';
        localStorage.setItem('glowr_lang', nextLang);
        setLanguage(nextLang);
    };

    const login = (userData) => {
        localStorage.setItem('glowr_token', userData.token);
        localStorage.setItem('glowr_user_id', userData._id);
        localStorage.setItem('glowr_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('glowr_token');
        localStorage.removeItem('glowr_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, language, toggleLanguage }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
