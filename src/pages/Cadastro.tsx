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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  User,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/service/api";

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [alunoData, setAlunoData] = useState({
    nome: "",
    email: "",
    matricula: "",
    curso: "",
    senha: "",
    confirmarSenha: "",
  });

  const [professorData, setProfessorData] = useState({
    nome: "",
    email: "",
    departamento: "",
    areasPesquisa: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleCadastroAluno = async (e: React.FormEvent) => {
    e.preventDefault();

    if (alunoData.senha !== alunoData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        username: alunoData.nome,
        email: alunoData.email,
        password: alunoData.senha,
        password2: alunoData.confirmarSenha,
        matricula: alunoData.matricula,
        curso: alunoData.curso,
      };

      const resposta = await apiPost(
        "http://localhost:8000/api/signup/aluno/",
        payload
      );

      localStorage.setItem("userType", "aluno");
      localStorage.setItem("userName", resposta.user.username);
      localStorage.setItem("accessToken", resposta.access_token);

      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao ICUSP.",
      });

      navigate("/projetos");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível realizar o cadastro.";

      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCadastroProfessor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (professorData.senha !== professorData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        username: professorData.nome,
        email: professorData.email,
        password: professorData.senha,
        password2: professorData.confirmarSenha,
        departamento: professorData.departamento,
        areas_pesquisa: professorData.areasPesquisa,
      };

      const resposta = await apiPost(
        "http://localhost:8000/api/signup/professor/",
        payload
      );

      localStorage.setItem("userType", "professor");
      localStorage.setItem("userName", resposta.user.username);
      localStorage.setItem("accessToken", resposta.access_token);

      toast({
        title: "Cadastro realizado!",
        description: "Agora você pode adicionar seus projetos.",
      });

      navigate("/projetos");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível realizar o cadastro.";

      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative flex items-center justify-center p-6 overflow-hidden">
      {/* Gradiente global */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6a5cff] via-[#3f4aff] to-[#2fb6ff] opacity-30" />

      {/* Glow suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6a5cff33] to-transparent blur-3xl opacity-40" />

      {/* Conteúdo */}
      <div className="relative w-full max-w-3xl">
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
            <div className="w-20 h-20 bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-500/40">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>

            <div>
              <CardTitle className="text-3xl font-extrabold">
                Criar sua conta
              </CardTitle>
              <CardDescription className="text-white/70">
                Escolha seu tipo de cadastro e comece a usar o ICUSP
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="aluno" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white mb-6">
                <TabsTrigger
                  value="aluno"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6a5cff] data-[state=active]:to-[#2fb6ff] data-[state=active]:text-white rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Aluno
                </TabsTrigger>
                <TabsTrigger
                  value="professor"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6a5cff] data-[state=active]:to-[#2fb6ff] data-[state=active]:text-white rounded-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  Professor
                </TabsTrigger>
              </TabsList>

              {/* === CADASTRO ALUNO === */}
              <TabsContent value="aluno">
                <form onSubmit={handleCadastroAluno} className="space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="aluno-nome" className="text-white/80">
                      Nome Completo
                    </Label>
                    <Input
                      id="aluno-nome"
                      placeholder="Seu nome completo"
                      value={alunoData.nome}
                      onChange={(e) =>
                        setAlunoData({ ...alunoData, nome: e.target.value })
                      }
                      className="bg-white/20 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="aluno-email" className="text-white/80">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input
                        id="aluno-email"
                        type="email"
                        placeholder="seu.email@usp.br"
                        value={alunoData.email}
                        onChange={(e) =>
                          setAlunoData({ ...alunoData, email: e.target.value })
                        }
                        className="pl-10 bg-white/20 border-white/20 text-white placeholder-white/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Matrícula & Curso */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aluno-matricula" className="text-white/80">
                        Matrícula
                      </Label>
                      <Input
                        id="aluno-matricula"
                        placeholder="202312345"
                        value={alunoData.matricula}
                        onChange={(e) =>
                          setAlunoData({
                            ...alunoData,
                            matricula: e.target.value,
                          })
                        }
                        className="bg-white/20 border-white/20 text-white placeholder-white/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aluno-curso" className="text-white/80">
                        Curso
                      </Label>
                      <Input
                        id="aluno-curso"
                        placeholder="Ciência da Computação"
                        value={alunoData.curso}
                        onChange={(e) =>
                          setAlunoData({ ...alunoData, curso: e.target.value })
                        }
                        className="bg-white/20 border-white/20 text-white placeholder-white/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="aluno-senha" className="text-white/80">
                      Senha
                    </Label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />

                      <Input
                        id="aluno-senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={alunoData.senha}
                        onChange={(e) =>
                          setAlunoData({ ...alunoData, senha: e.target.value })
                        }
                        className="pl-10 pr-10 bg-white/20 border-white/20 text-white placeholder-white/50"
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

                  {/* Confirmar senha */}
                  <div className="space-y-2">
                    <Label htmlFor="aluno-confirmar" className="text-white/80">
                      Confirmar Senha
                    </Label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />

                      <Input
                        id="aluno-confirmar"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={alunoData.confirmarSenha}
                        onChange={(e) =>
                          setAlunoData({
                            ...alunoData,
                            confirmarSenha: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 bg-white/20 border-white/20 text-white placeholder-white/50"
                        required
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Botão aluno */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] hover:opacity-90 shadow-lg shadow-blue-500/30 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar como Aluno"}
                  </Button>
                </form>
              </TabsContent>

              {/* === CADASTRO PROFESSOR === */}
              <TabsContent value="professor">
                <form onSubmit={handleCadastroProfessor} className="space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-nome" className="text-white/80">
                      Nome Completo
                    </Label>
                    <Input
                      id="prof-nome"
                      placeholder="Prof. Dr. Seu Nome"
                      value={professorData.nome}
                      onChange={(e) =>
                        setProfessorData({
                          ...professorData,
                          nome: e.target.value,
                        })
                      }
                      className="bg-white/20 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-email" className="text-white/80">
                      Email Institucional
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input
                        id="prof-email"
                        type="email"
                        placeholder="professor@universidade.br"
                        value={professorData.email}
                        onChange={(e) =>
                          setProfessorData({
                            ...professorData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 bg-white/20 border-white/20 text-white placeholder-white/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Departamento */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-depart" className="text-white/80">
                      Departamento
                    </Label>
                    <Input
                      id="prof-depart"
                      placeholder="Departamento de Computação"
                      value={professorData.departamento}
                      onChange={(e) =>
                        setProfessorData({
                          ...professorData,
                          departamento: e.target.value,
                        })
                      }
                      className="bg-white/20 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>

                  {/* Áreas */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-area" className="text-white/80">
                      Áreas de Pesquisa
                    </Label>
                    <Input
                      id="prof-area"
                      placeholder="IA, Machine Learning, Robótica..."
                      value={professorData.areasPesquisa}
                      onChange={(e) =>
                        setProfessorData({
                          ...professorData,
                          areasPesquisa: e.target.value,
                        })
                      }
                      className="bg-white/20 border-white/20 text-white placeholder-white/50"
                      required
                    />
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-senha" className="text-white/80">
                      Senha
                    </Label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />

                      <Input
                        id="prof-senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={professorData.senha}
                        onChange={(e) =>
                          setProfessorData({
                            ...professorData,
                            senha: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 bg-white/20 border-white/20 text-white placeholder-white/50"
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

                  {/* Confirmar senha */}
                  <div className="space-y-2">
                    <Label htmlFor="prof-confirmar" className="text-white/80">
                      Confirmar Senha
                    </Label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />

                      <Input
                        id="prof-confirmar"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={professorData.confirmarSenha}
                        onChange={(e) =>
                          setProfessorData({
                            ...professorData,
                            confirmarSenha: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 bg-white/20 border-white/20 text-white placeholder-white/50"
                        required
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Botão professor */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] hover:opacity-90 shadow-lg shadow-blue-500/30 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar como Professor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Link login */}
            <div className="text-center text-sm text-white/70 mt-6">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-[#ffcf4b] hover:text-[#ffcf4b]/80 font-medium"
              >
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;