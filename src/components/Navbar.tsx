import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, BookOpen, Home, Plus, LogOut, MessageCircle } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const type = localStorage.getItem("userType");
      const name = localStorage.getItem("userName");
      const id = localStorage.getItem("userId");
      setIsLoggedIn(!!type);
      setUserType(type || "");
      setUserName(name || "");
      setUserId(id);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    setUserType("");
    window.location.href = "/";
  };

  return (
    <nav className="bg-gradient-hero/80 backdrop-blur-md shadow-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md transition-all group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide drop-shadow-sm">
              ICUSP
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-white/80 hover:text-white transition"
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </Link>
            <Link
              to="/projetos"
              className="flex items-center space-x-1 text-white/80 hover:text-white transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Projetos</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/conversas"
                className="flex items-center space-x-1 text-white/80 hover:text-white transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversas</span>
              </Link>
            )}

            {isLoggedIn && userType === "professor" && (
              <Link
                to="/adicionar-projeto"
                className="flex items-center space-x-1 text-white/80 hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar IC</span>
              </Link>
            )}
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-white/80">
                  Olá,{" "}
                  {userType === "professor" && userId ? (
                    <Link to={`/professor/${userId}`} className="font-semibold text-white hover:underline">
                      {userName.split(" ")[0]}
                    </Link>
                  ) : (
                    <span className="font-semibold text-white">{userName.split(" ")[0]}</span>
                  )}
                </span>

                <Button
                variant="hero"
                size="default"
                onClick={handleLogout}
                className="shadow-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="hero" size="default" className="shadow-md">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isOpen && (
          <div className="md:hidden bg-gradient-hero/90 backdrop-blur-xl border-t border-white/10 shadow-lg rounded-b-xl py-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-white/80 hover:text-white transition"
            >
              Início
            </Link>

            <Link
              to="/projetos"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-white/80 hover:text-white transition"
            >
              Projetos
            </Link>

            {isLoggedIn && (
              <Link
                to="/conversas"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white/80 hover:text-white transition"
              >
                Conversas
              </Link>
            )}

            {isLoggedIn && userType === "professor" && (
              <Link
                to="/adicionar-projeto"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white/80 hover:text-white transition"
              >
                Adicionar IC
              </Link>
            )}

            <div className="mt-4 px-4">
              {isLoggedIn ? (
                <>
                  <p className="text-white/80 mb-2">
                    Olá,{" "}
                    {userType === "professor" && userId ? (
                      <Link to={`/professor/${userId}`} className="text-white font-semibold hover:underline">
                        {userName.split(" ")[0]}
                      </Link>
                    ) : (
                      <span className="text-white font-semibold">{userName.split(" ")[0]}</span>
                    )}
                  </p>

                  <Button
                    onClick={handleLogout}
                    className="w-full border-white/40 text-white hover:bg-white/10"
                    variant="outline"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="hero">
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
