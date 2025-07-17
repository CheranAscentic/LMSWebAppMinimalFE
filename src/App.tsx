import { Book } from "lucide-react"
import { useEffect } from "react"
import Navigation from "./components/navigation"
// import useUser from "./hooks/useUser"
// import { LoginForm } from "./pages/LoginForm"
// import  BooksList  from "./pages/BooksList"
// import { RegisterForm } from "./pages/RegisterForm"
// import MyBooks from "./pages/MyBooks"
// import AllUsers from "./pages/AllUsers"
import useNavigation from "./hooks/useNavigation"
import useUser from "./hooks/useUser"

function App() {
  const { appUser } = useUser();
  const { navItems, viewPage, setViewPage } = useNavigation(appUser);


  // const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    document.title = "Lib-X - Library Management System"
  }, [])

  // const handlePageChange = (page: string) => {
  //   if (page === "logout") {
  //     logout();
  //     setCurrentPage("login");
    
  //   } else {
  //     setCurrentPage(page);
  //   }
  // };

  // interface LoginUserData {
  //   user: {
  //     id: number;
  //     name: string;
  //     email: string;
  //     type: string;
  //   };
  //   token: string;
  // };

  // const handleLoginSuccess = (userData: LoginUserData) => {
  //   setAppUser({
  //     isloggedIn: true,
  //     id: userData.user.id,
  //     name: userData.user.name,
  //     email: userData.user.email,
  //     role: userData.user.type as "Member" | "StaffMinor" | "StaffManagement" | "none",
  //     token: userData.token
  //   });
  //   setCurrentPage("dashboard");
  // };

  // const handleRegisterSuccess = () => {
  //   setCurrentPage("login");
  // };

  // const renderPageContent = () => {
  //   switch (currentPage) {
  //     case "login":
  //       return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  //     case "register":
  //       return <RegisterForm onRegisterSuccess={handleRegisterSuccess} />;
  //     case "browse":
  //       return <BooksList />;
  //     case "mybooks":
  //       return <MyBooks userId={user.id} />;
  //     case "user-management":
  //       return <AllUsers currentUserRole={user.role} />;
  //     case "dashboard":
  //       return (
  //         <div className="p-4">
  //           <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
  //           <p>Welcome to your dashboard, {user.name}!</p>
  //         </div>
  //       );
  //     case "manage-books":
  //       return <div className="p-4">Manage Books Page (To be implemented)</div>;
  //     case "reports":
  //       return <div className="p-4">Reports Page (To be implemented)</div>;
  //     case "settings":
  //       return <div className="p-4">Settings Page (To be implemented)</div>;
  //     default:
  //       return <div className="p-4">Page not found</div>;
  //   }
  // };

  return (
    <main className="bg-background h-screen grid grid-rows-[150px_auto] grid-cols-[300px_auto] overflow-y-auto">
  {/* Header: spans both columns */}
  <div className="flex justify-between items-center bg-primary p-6 col-span-2">
    <h1 className="text-3xl font-bold text-primary-foreground">Welcome to Lib-X</h1>
    <Book className="w-10 h-10 text-primary-foreground" />
  </div>
  {/* Sidebar */}
  <div className="bg-sidebar border border-sidebar-border p-5">
    <Navigation navItems={navItems} setViewPage={setViewPage} />
  </div>
  {/* Main Content */}
  <div className="bg-card border border-border p-5 overflow-y-auto">
    {viewPage}
  </div>
</main>
  )
}

export default App
