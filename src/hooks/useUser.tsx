import { useEffect, useState } from "react";
import type { User } from "../models/User";

export default function useUser() {

    const defaultAppUser: User = {
        isloggedIn: false,
        id: 0,
        name: "",
        email: "",
        type: "none",
        token: ""
    };

    const [appUser, setAppUser] = useState<User>(() => {
        const savedUser = localStorage.getItem("appuser");
        return savedUser ? JSON.parse(savedUser) : defaultAppUser;
    });

    useEffect(() => {
    localStorage.setItem("appuser", JSON.stringify(appUser))
    }, [appUser]);

    function logout() {
        setAppUser(defaultAppUser);
        localStorage.removeItem("appuser");
    }

    return (
        {
            appUser,
            setAppUser,
            logout,
        }
    )

    
}