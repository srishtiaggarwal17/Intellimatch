import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Upload,
  History,
} from "lucide-react";
import api from "../services/api";
import { useToast } from "../hooks/use-toast";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
    } catch {}
    finally {
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      window.location.href = "/login";
    }
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/history", label: "History", icon: History },
  ];

  const isActive = path => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">

      <header className="sticky top-0 z-50 border-b bg-card shadow-card">
        <div className="container mx-auto px-4">

          <div className="flex h-16 items-center justify-between">

            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  IM
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                IntelliMatch
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className="flex gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card py-6 text-center text-sm text-muted-foreground">
        © 2025 IntelliMatch. AI-powered resume matching.
      </footer>
    </div>
  );
}
