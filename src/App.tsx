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
  const { appUser, setAppUser, logout } = useUser();
  const { navItems, viewPage, setViewPage } = useNavigation({appUser, setAppUser, logout});


  // const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    document.title = "Lib-X - Library Management System"
  }, [])

  return (
    <main className="bg-background h-screen grid grid-rows-[150px_auto] grid-cols-[300px_auto] overflow-y-auto">
  {/* Header: spans both columns */}
  <div className="flex justify-between items-center bg-primary p-6 col-span-2">
  <div>
    <h1 className="text-3xl font-bold text-primary-foreground">
      {appUser?.isloggedIn
        ? `Welcome, ${appUser.name}!`
        : "Welcome to Lib-X"}
    </h1>
    {appUser?.isloggedIn && (
      <h2 className="text-lg font-medium text-primary-foreground opacity-80 mt-1">
        Role: {appUser.type}
      </h2>
    )}
  </div>
  <Book className="w-10 h-10 text-primary-foreground" />
</div>
  {/* Sidebar */}
  <div className="bg-sidebar border border-sidebar-border p-5">
    <Navigation navItems={navItems} setViewPage={setViewPage}/>
  </div>
  {/* Main Content */}
  <div className="bg-card border border-border p-5 overflow-y-auto">
    {viewPage}
  </div>
</main>
  )
}

export default App
