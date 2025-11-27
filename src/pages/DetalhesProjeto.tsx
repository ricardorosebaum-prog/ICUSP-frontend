import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Clock,
  BookOpen,
  Target,
  DollarSign,
  Users,
  Mail,
  Phone,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { apiGet, apiPostToken, apiGetToken, apiDeleteToken } from "@/service/api";


const DetalhesProjeto = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [projeto, setProjeto] = useState<ProjetoIC>();
  const [loading, setLoading] = useState(true);
  const [interesseId, setInteresseId] = useState<number | null>(null);
  const userType = localStorage.getItem("userType");

  interface Interessado {
    id: number;
    username: string;
    email: string;
    matricula: string;
    curso: string;
  }

  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [loadingInteressados, setLoadingInteressados] = useState(false);

  interface ProfessorData {
    id: number;
    username: string;
    email: string;
  }

  interface ProjetoIC {
    id: number;
    titulo: string;
    area_pesquisa: string;
    descricao: string;
    duracao: string;
    status?: string;
    tags: string;
    tipo_bolsa?: string;
    valor_bolsa?: number;
    numero_vagas?: number;
    bolsa_disponivel?: boolean;
    objetivos?: string | null;
    requisitos?: string | null;
    professor?: ProfessorData | null;
  }


  // 🔹 Buscar interesses do aluno e verificar se tem interesse neste projeto

  const handleRemoverInteresse = async () => {
    try {
      await apiDeleteToken(
        `http://localhost:8000/api/iniciacao/interesse/remover/${interesseId}/`
      );

      setInteresseId(null);

      toast({
        title: "Interesse removido",
        description: "Você deixou de demonstrar interesse neste projeto.",
      });
    } catch (err) {
      toast({
        title: "Erro ao remover interesse",
        description: err.message,
        variant: "destructive",
      });
    }
  };  

  useEffect(() => {
    if (!projeto?.id) return;

    async function fetchInteresses() {
      try {
        const interesses = await apiGetToken(
          "http://localhost:8000/api/iniciacao/interesse/listar/"
        );
        const interesseAtual = interesses.find(
          (item) => item.iniciacao === projeto.id
        );

        if (interesseAtual) {
          setInteresseId(interesseAtual.id);
        }
      } catch (err) {
        console.error("Erro ao buscar interesses:", err);
      }
    }

    fetchInteresses();
  }, [projeto, interesseId]);


  //  Buscar lista de estudantes interessados (visível apenas ao professor dono)
  useEffect(() => {
    if (!projeto?.id) return;

    // Só buscar se o usuário for professor e for o professor dono do projeto
    const loggedUserId = Number(localStorage.getItem("userId"));
    if (userType !== "professor" || projeto.professor?.id !== loggedUserId) return;

    async function fetchInteressados() {
      setLoadingInteressados(true);
      try {
        const data = await apiGetToken(
          `http://localhost:8000/api/iniciacao/${projeto.id}/interessados/`
        );

        setInteressados(data || []);
      } catch (err) {
        console.error("Erro ao buscar interessados:", err);
        toast({
          title: "Erro ao carregar interessados",
          description: "Não foi possível obter a lista de alunos interessados.",
          variant: "destructive",
        });
      } finally {
        setLoadingInteressados(false);
      }
    }

    fetchInteressados();
  }, [projeto, userType, toast]);

  const handleCandidatar = async () => {
    try {
      const resp = await apiPostToken(
        "http://localhost:8000/api/iniciacao/interesse/",
        { iniciacao: projeto?.id }
      );

      setInteresseId(resp.id);

      toast({
        title: "Interesse registrado!",
        description: "Você demonstrou interesse no projeto.",
      });
    } catch (err) {
      toast({
        title: "Erro ao enviar interesse",
        description: err.message,
        variant: "destructive",
      });
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-500/20 text-blue-300 border border-blue-400/20";
      case "Concluído":
        return "bg-green-500/20 text-green-300 border border-green-400/20";
      case "Recrutando":
        return "bg-orange-500/20 text-orange-300 border border-orange-400/20";
      default:
        return "bg-white/10 text-white/80 border border-white/20";
    }
  };

  useEffect(() => {
    async function fetchProjeto() {
      try {
        const data = await apiGet(`http://localhost:8000/api/iniciacao/${id}/`);
        setProjeto(data);
      } catch (err) {
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível buscar os dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProjeto();
  }, [id, toast]);

  if (loading || !projeto) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/projetos">
            <Button
              className="text-white bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-xl backdrop-blur-lg shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar aos projetos
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge
              className={`${getStatusColor(
                projeto.status || ""
              )} px-3 py-1 rounded-lg`}
            >
              {projeto.status || "Sem status"}
            </Badge>

            <Badge className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg">
              {projeto.area_pesquisa}
            </Badge>

            <Badge className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg">
              {projeto.numero_vagas} vagas
            </Badge>

            {projeto.bolsa_disponivel && (
              <Badge className="bg-green-500/20 text-green-300 border border-green-400/20 px-3 py-1 rounded-lg">
                <DollarSign className="w-3 h-3 mr-1" />
                Com Bolsa
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white">
            {projeto.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <span className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {projeto.professor?.username || "Sem professor"}
            </span>

            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {projeto.duracao}
            </span>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descrição */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Descrição do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed">
                {projeto.descricao}
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="w-5 h-5 mr-2" />
                  Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed">
                {projeto.objetivos || "Nenhum objetivo informado."}
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Requisitos</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed">
                {projeto.requisitos || "Nenhum requisito informado."}
              </CardContent>
            </Card>

            {/* Bolsa */}
            {projeto.bolsa_disponivel && (
              <Card className="bg-green-500/10 backdrop-blur-xl border border-green-400/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-300">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Informações da Bolsa
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-white/80">
                  <div className="flex justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span>R${projeto.valor_bolsa}</span>
                    <span className="font-semibold">
                      {projeto.tipo_bolsa}
                    </span>
                  </div>

                  <p className="text-xs text-white/60">
                    A bolsa depende da aprovação e disponibilidade de recursos.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Interessados (apenas visível ao professor dono) - movido para coluna principal */}
            {userType === "professor" && Number(localStorage.getItem("userId")) === projeto.professor?.id && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl mt-4">
                <CardHeader>
                  <CardTitle className="text-white">Interessados</CardTitle>
                  <CardDescription className="text-white/70">
                    {loadingInteressados ? "Carregando..." : `${interessados.length} estudante(s)`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {loadingInteressados ? (
                    <div className="text-white/70">Carregando interessados...</div>
                  ) : interessados.length === 0 ? (
                    <div className="text-white/70">Nenhum aluno interessado ainda.</div>
                  ) : (
                    <div className="space-y-3">
                      {interessados.map((i) => (
                        <div key={i.id} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-white">{i.username}</div>
                            <div className="text-xs text-white/60">{i.curso}</div>
                          </div>

                          <div className="text-xs text-white/60 mt-1">Matrícula: {i.matricula}</div>

                          <div className="flex items-center mt-2 text-sm text-white/70">
                            <Mail className="w-4 h-4 mr-2" />
                            <a className="underline" href={`mailto:${i.email}`}>{i.email}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidatar */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Candidatar-se</CardTitle>
              <CardDescription className="text-white/70">
                Interessado neste projeto?
              </CardDescription>
            </CardHeader>

            <CardContent>

             {userType === "aluno" && (
                  interesseId ? (
                    <Button
                      onClick={handleRemoverInteresse}
                      className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition"
                    >
                      Remover Interesse
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCandidatar}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:scale-[1.02] transition"
                    >
                      Enviar Candidatura
                    </Button>
                  )
                )}

              <Link to={`/chat-projeto/${id}`}>
                <Button
                  className="w-full mt-3 bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-lg shadow"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Chat do Projeto
                </Button>
              </Link>

              <p className="text-xs text-white/60 text-center mt-3">
                Sua candidatura será enviada ao orientador
              </p>

            </CardContent>
          </Card>

            {/* Contato */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">
                  Contato do Orientador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/80">
                <p className="font-semibold">
                  {projeto.professor?.username || "Sem nome informado"}
                </p>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-white/50" />
                    <span className="text-sm">
                      {projeto.professor?.email || "Sem email informado"}
                    </span>
                  </div>
                </div>

                <Separator className="bg-white/10" />
              <Link to={`/professor/${projeto.professor.id}`}>
                <Button
                  className="w-full bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-lg shadow"
                >
                  Ver Perfil Completo
                </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Interessados (apenas visível ao professor dono) */}
            {/* Moved to main column */}

            {/* Tags */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">
                  Temas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projeto.tags.split(",").map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-xl text-sm text-white/80"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesProjeto;
