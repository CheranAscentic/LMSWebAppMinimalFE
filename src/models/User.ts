export interface User {
    isloggedIn: boolean;
    id: number;
    name: string;
    email: string;
    type: "Member" | "StaffMinor" | "StaffManagement" | "none";
    token: string;
    firstName?: string;
    lastName?: string;
    address?: string;
}