import { useState, useEffect, type ReactNode, useMemo } from "react";
import BooksList from "../pages/BooksList";
import MyBooks from "../pages/MyBooks";
import AllUsers from "../pages/AllUsers";
import type { User } from "../models/User";


export default function useNavigation(appUser: User) {

    interface NavItem {
        label: string;
        page: ReactNode;
        roles?: string[];
    }

    const [navItems, setNavItems] = useState<NavItem[]>([]);   
    const [viewPage, setViewPage] = useState<ReactNode>(<BooksList />);     

    const items = useMemo(() =>
        [
        {
            label: "Browse Books",
            page: <BooksList />,
            roles: ["none", "Member", "StaffMinor", "StaffManagement"]
        },
        {
            label: "Login",
            page: <div className="p-6"><h2 className="text-2xl font-bold mb-4">Login</h2><p>Please login to access your account</p></div>,
            roles: ["none"]
        },
        {
            label: "Register",
            page: <div className="p-6"><h2 className="text-2xl font-bold mb-4">Register</h2><p>Create a new account to start using the library</p></div>,
            roles: ["none"]
        },
        {
            label: "Logout",
            page: <div className="p-6"><h2 className="text-2xl font-bold mb-4">Logout</h2><p>You have been logged out successfully</p></div>,
            roles: ["Member", "StaffMinor", "StaffManagement"]
        },
        {
            label: "My Books",
            page: <MyBooks userId={appUser.id} />,
            roles: ["Member"]
        },
        {
            label: "User Management",
            page: <AllUsers currentUserRole={appUser.role} />,
            roles: ["StaffManagement"]
        },
        {
            label: "Manage Books",
            page: (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Manage Books</h2>
                    <p>Add, edit, or remove books from the library</p>
                </div>
            ),
            roles: ["StaffMinor", "StaffManagement"]
        },
        {
            label: "Reports",
            page: (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Reports</h2>
                    <p>View library statistics and reports</p>
                </div>
            ),
            roles: ["StaffMinor", "StaffManagement"]
        },
        {
            label: "Settings",
            page: (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Settings</h2>
                    <p>Configure your account settings</p>
                </div>
            ),
            roles: ["Member", "StaffMinor", "StaffManagement"]
        }
    ]
    , [appUser.role, appUser.id]);

    useEffect(() => {
        if (!appUser) return;
        const defaultPage = items.find(item => item.roles?.includes(appUser.role))?.page;
        if (defaultPage) {
            setViewPage(defaultPage);
        }
    }, [appUser, items]);

    useEffect(() => {
        setNavItems(items.filter(item => !item.roles || item.roles.includes(appUser.role)));
    }, [appUser, items]);

    return {
        navItems,
        viewPage,
        setViewPage
    };


}