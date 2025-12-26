import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-slate-200/50 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-blue-50/40 to-white/60 backdrop-blur-xl" />
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="text-xl font-bold tracking-tight text-slate-900">ChatFlow AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isAuthenticated ? (
            <Button onClick={() => navigate("/dashboard")} className="shadow-md">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")} className="shadow-md">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
