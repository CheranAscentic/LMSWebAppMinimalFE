export interface User {
    isloggedIn: boolean;
    id: number;
    name: string;
    email: string;
    role: "Member" | "StaffMinor" | "StaffManagement" | "none";
    token: string;
}