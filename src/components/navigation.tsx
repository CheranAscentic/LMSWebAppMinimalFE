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
            {navItems.map((navItem, index) => (
                <Button
                    key={index}
                    variant="secondary"
                    className="w-full justify-start text-left"
                    onClick={() => handleNavClick(navItem)}
                >
                    {navItem.label}
                </Button>
            ))}
        </div>
    );
}