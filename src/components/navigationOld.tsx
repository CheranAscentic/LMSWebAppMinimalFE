import useUser from "../hooks/useUser";

interface NavigationProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

interface NavItem {
  name: string;
  page: string;
  roles: Array<"Member" | "StaffMinor" | "StaffManagement" | "none">;
}

export default function Navigation({onPageChange, currentPage }: NavigationProps) {

    const {
        appUser
    } = useUser();
  const navItems: NavItem[] = [
    { name: "Dashboard", page: "dashboard", roles: ["Member", "StaffMinor", "StaffManagement"] },
    { name: "Browse Books", page: "browse", roles: ["Member", "StaffMinor", "StaffManagement", "none"] },
    { name: "My Books", page: "mybooks", roles: ["Member", "StaffMinor", "StaffManagement"] },
    { name: "Manage Books", page: "manage-books", roles: ["StaffMinor", "StaffManagement"] },
    { name: "User Management", page: "user-management", roles: ["StaffManagement"] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(appUser.role)
  );

  if (!appUser.isloggedIn) {
    return (
      <div className="flex flex-col space-y-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className={`w-full p-3 text-left rounded-lg transition-colors ${
              currentPage === item.page 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {item.name}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange("login")}
          className={`w-full p-3 text-left rounded-lg transition-colors ${
            currentPage === "login" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          Login
        </button>
        <button 
          onClick={() => onPageChange("register")}
          className={`w-full p-3 text-left rounded-lg transition-colors ${
            currentPage === "register" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-foreground text-sm mb-4 bg-card border border-border p-3 rounded-lg">
        <p>Welcome, {appUser.name}</p>
        <p className="text-muted-foreground">Role: {appUser.role}</p>
      </div>
      
      {filteredNavItems.map((item) => (
        <button
          key={item.page}
          onClick={() => onPageChange(item.page)}
          className={`w-full p-3 text-left rounded-lg transition-colors ${
            currentPage === item.page 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {item.name}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange("logout")}
        className="w-full p-3 text-left rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors mt-4"
      >
        Logout
      </button>
    </div>
  );
}

