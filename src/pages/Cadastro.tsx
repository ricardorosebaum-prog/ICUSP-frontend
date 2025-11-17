import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, GraduationCap, BookOpen } from "lucide-react";
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
    confirmarSenha: ""
  });

  const [professorData, setProfessorData] = useState({
    nome: "",
    email: "",
    departamento: "",
    areasPesquisa: "",
    senha: "",
    confirmarSenha: ""
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
      matricula: alunoData.matricula,
      curso: alunoData.curso,
      password: alunoData.senha,
    };

    await apiPost("http://localhost:8000/api/signup/", payload);

    toast({
      title: "Cadastro realizado!",
      description: "Bem-vindo ao ICUSP.",
    });

    navigate("/projetos");
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Não foi possível realizar o cadastro.";

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
        variant: "destructive"
      });
      return;
    }

  try {
    setIsLoading(true);

    const payload = {
      username: professorData.nome,
      password: professorData.senha,
    };

    const resposta = await apiPost("http://localhost:8000/api/signup/", payload);

    localStorage.setItem("userType", "professor");
    localStorage.setItem("userName", resposta.nome);

    toast({
      title: "Cadastro realizado!",
      description: "Agora você pode adicionar seus projetos.",
    });

    navigate("/adicionar-projeto");
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Não foi possível realizar o cadastro.";

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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm shadow-strong border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Criar sua conta</CardTitle>
              <CardDescription className="text-muted-foreground">
                Escolha seu tipo de cadastro e comece a usar o ICUSP
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="aluno" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="aluno" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Aluno
                </TabsTrigger>
                <TabsTrigger value="professor" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Professor
                </TabsTrigger>
              </TabsList>

              {/* Cadastro Aluno */}
              <TabsContent value="aluno">
                <form onSubmit={handleCadastroAluno} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aluno-nome">Nome Completo</Label>
                    <Input
                      id="aluno-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={alunoData.nome}
                      onChange={(e) => setAlunoData({ ...alunoData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aluno-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="aluno-email"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={alunoData.email}
                        onChange={(e) => setAlunoData({ ...alunoData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aluno-matricula">Matrícula</Label>
                      <Input
                        id="aluno-matricula"
                        type="text"
                        placeholder="202312345"
                        value={alunoData.matricula}
                        onChange={(e) => setAlunoData({ ...alunoData, matricula: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aluno-curso">Curso</Label>
                      <Input
                        id="aluno-curso"
                        type="text"
                        placeholder="Ciência da Computação"
                        value={alunoData.curso}
                        onChange={(e) => setAlunoData({ ...alunoData, curso: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aluno-senha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="aluno-senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={alunoData.senha}
                        onChange={(e) => setAlunoData({ ...alunoData, senha: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aluno-confirmar-senha">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="aluno-confirmar-senha"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={alunoData.confirmarSenha}
                        onChange={(e) => setAlunoData({ ...alunoData, confirmarSenha: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar como Aluno"}
                  </Button>
                </form>
              </TabsContent>

              {/* Cadastro Professor */}
              <TabsContent value="professor">
                <form onSubmit={handleCadastroProfessor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prof-nome">Nome Completo</Label>
                    <Input
                      id="prof-nome"
                      type="text"
                      placeholder="Prof. Dr. Seu Nome"
                      value={professorData.nome}
                      onChange={(e) => setProfessorData({ ...professorData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-email">Email Institucional</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="prof-email"
                        type="email"
                        placeholder="professor@universidade.edu.br"
                        value={professorData.email}
                        onChange={(e) => setProfessorData({ ...professorData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-departamento">Departamento</Label>
                    <Input
                      id="prof-departamento"
                      type="text"
                      placeholder="Departamento de Ciência da Computação"
                      value={professorData.departamento}
                      onChange={(e) => setProfessorData({ ...professorData, departamento: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-areas">Áreas de Pesquisa</Label>
                    <Input
                      id="prof-areas"
                      type="text"
                      placeholder="IA, Machine Learning, Computação em Nuvem"
                      value={professorData.areasPesquisa}
                      onChange={(e) => setProfessorData({ ...professorData, areasPesquisa: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-senha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="prof-senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={professorData.senha}
                        onChange={(e) => setProfessorData({ ...professorData, senha: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-confirmar-senha">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="prof-confirmar-senha"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={professorData.confirmarSenha}
                        onChange={(e) => setProfessorData({ ...professorData, confirmarSenha: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar como Professor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-muted-foreground mt-6">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
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