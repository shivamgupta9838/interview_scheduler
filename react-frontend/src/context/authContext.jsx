import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser ? JSON.parse(storedUser) : null;
    });

    function login(userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        navigate("/", { replace: true });
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}