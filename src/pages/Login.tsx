import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/service/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        username: login,
        password: password,
      };

      const resposta = await apiPost("https://icuspbackend.onrender.com/api/login/", payload);
      localStorage.setItem("userType", resposta.user.role);
      localStorage.setItem("userName", resposta.user.username);
      localStorage.setItem("userId", resposta.user.id);
      localStorage.setItem("accessToken", resposta.access_token);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao ICUSP.",
      });

      navigate("/projetos");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro inesperado.";

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative flex items-center justify-center p-6 overflow-hidden">

      {/* Background gradiente global */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6a5cff] via-[#3f4aff] to-[#2fb6ff] opacity-30" />

      {/* Glow suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6a5cff33] to-transparent blur-3xl opacity-40" />

      {/* Conteúdo */}
      <div className="relative w-full max-w-md">

        {/* Botão voltar */}
        <div className="mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Button>
          </Link>
        </div>

        <Card className="bg-white/10 border-white/10 backdrop-blur-xl shadow-2xl shadow-blue-500/20 text-white">
          <CardHeader className="text-center space-y-4">
            {/* Ícone */}
            <div className="w-20 h-20 bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-500/40">
              <Lock className="w-10 h-10 text-white" />
            </div>

            {/* Texto topo */}
            <div>
              <CardTitle className="text-3xl font-extrabold">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-white/70">
                Entre na sua conta para acessar os projetos de IC
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Login */}
              <div className="space-y-2">
                <Label htmlFor="login" className="text-white/80">Usuário ou email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
                  <Input
                    id="login"
                    placeholder="seu.email@usp.br"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="pl-10 bg-white/20 border-white/20 text-white placeholder-white/50 focus:border-[#6a5cff]"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/20 border-white/20 text-white placeholder-white/50 focus:border-[#6a5cff]"
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Link esquecer senha */}
              <div className="flex items-center justify-between">
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-[#ffcf4b] hover:text-[#ffcf4b]/80 transition"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Botão login */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] hover:opacity-90 shadow-lg shadow-blue-500/30 text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              {/* Link para cadastro */}
              <div className="text-center text-sm text-white/70">
                Não tem uma conta?{" "}
                <Link
                  to="/cadastro"
                  className="text-[#ffcf4b] hover:text-[#ffcf4b]/80 font-medium"
                >
                  Cadastre-se
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
