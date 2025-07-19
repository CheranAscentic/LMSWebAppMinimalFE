import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface NavItem {
            label: string;
            page: ReactNode;
            roles?: string[];
        }

interface NavigationProps {
  navItems: NavItem[];
  setViewPage: (page: ReactNode) => void;
}

export default function Navigation({ navItems, setViewPage }: NavigationProps) {

    const handleNavClick = (navItem: NavItem) => {
        console.log("Navigating to:", navItem);
        setViewPage(navItem.page);
    };

    return (
        <div className="flex flex-col space-y-3 w-full">
    {navItems.map((navItem, index) => {
        let variant: "secondary" | "destructive" | "default" | "outline" | "ghost" | "link" = "secondary";
        switch (navItem.label) {
            case "Logout":
                variant = "destructive";
                break;
            // case "Login":
            //     variant = "default";
            //     break;
            // case "Register":
            //     variant = "outline";
            //     break;
            // case "User Management":
            //     variant = "default";
            //     break;
            default:
                variant = "secondary";
        }
        return (
            <Button
                key={index}
                variant={variant}
                className="w-full justify-start text-left hover:border-2 hover:border-slate-800"
                onClick={() => handleNavClick(navItem)}
            >
                {navItem.label}
            </Button>
        );
    })}
</div>
    );
}