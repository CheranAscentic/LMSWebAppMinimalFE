import { useState, useEffect, type ReactNode, useMemo } from "react";
import BooksList from "../pages/BooksList";
// import MyBooks from "../pages/MyBooks";
import AllUsers from "../pages/AllUsers";
import type { User } from "../models/User";
import { LoginForm } from "@/pages/LoginForm";
import LogoutPage from "@/pages/LogoutPage";
import { RegisterForm } from "@/pages/RegisterForm";
import BorrowedBooks from "@/pages/BorrowedBooks";
import ManageBooks from "@/pages/ManageBooks";

interface UseNavigationProps {
    appUser: User;
    setAppUser: (user: User) => void;
    logout: () => void;
}


export default function useNavigation({ appUser, setAppUser, logout}: UseNavigationProps) {

    interface NavItem {
        label: string;
        page: ReactNode;
        roles?: string[];
    }

    const [navItems, setNavItems] = useState<NavItem[]>([]);   
    const [viewPage, setViewPage] = useState<ReactNode>(<BooksList appUser={appUser}/>);     

    const items = useMemo(() =>
        [
        {
            label: "Browse Books",
            page: <BooksList appUser={appUser}/>,
            roles: ["none", "Member"]
        },
        {
            label: "Login",
            page: <LoginForm setAppUser={setAppUser}/>,
            roles: ["none"]
        },
        {
            label: "Register",
            page: <RegisterForm />,
            roles: ["none"]
        },
        {
            label: "Borrowed Books",
            page: <BorrowedBooks userId={appUser.id} />,
            roles: ["Member"]
        },
        {
            label: "User Management",
            page: <AllUsers currentUserRole={appUser.type} />,
            roles: ["StaffManagement"]
        },
        {
            label: "Manage Books",
            page: <ManageBooks appUser={appUser}/>,
            roles: ["StaffMinor", "StaffManagement"]
        },
        {
            label: "Logout",
            page: <LogoutPage logout={logout} />,
            roles: ["Member", "StaffMinor", "StaffManagement"]
        },
    ]
    , [appUser, setAppUser]);

    useEffect(() => {
        if (!appUser) return;
        const defaultPage = items.find(item => item.roles?.includes(appUser.type))?.page;
        if (defaultPage) {
            setViewPage(defaultPage);
        }
    }, [appUser, items]);

    useEffect(() => {
        setNavItems(items.filter(item => !item.roles || item.roles.includes(appUser.type)));
    }, [appUser, items]);

    return {
        navItems,
        viewPage,
        setViewPage
    };


}