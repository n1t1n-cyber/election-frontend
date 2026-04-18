import { Link, useLocation, useNavigate } from "react-router-dom";
import { Vote, BarChart3, Home, UserPlus, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const leftItems = [{ path: "/", label: "Home", icon: Home }];

  const authItems = isLoggedIn
    ? [
        { path: "/vote", label: "Vote", icon: Vote },
        { path: "/results", label: "Results", icon: BarChart3 },
      ]
    : [];

  const rightItems = isLoggedIn
    ? []
    : [
        { path: "/register", label: "Register", icon: UserPlus },
        { path: "/login", label: "Login", icon: LogIn },
      ];

  const allNav = [...leftItems, ...authItems, ...rightItems];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Vote className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">
            ElectVote
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {allNav.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === path
                  ? "gradient-primary text-primary-foreground glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          {isLoggedIn && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;