import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Users,
  MessageCircle,
  ExternalLink,
  GraduationCap
} from "lucide-react";

import Navbar from "@/components/Navbar";

import { apiGet } from "@/service/api";
import { get } from "http";

// ---------------------------------------------
// TYPES
// ---------------------------------------------

type ProjetoProfessor = {
  id: number;
  titulo: string;
  status: string;
  alunos: number;
  inicio: string;
};

type ProfessorAPI = {
  id: string;
  username: string;
  email: string;
  iniciacoes?: {
    id: number;
    titulo: string;
    criado_em: string;
  }[];
  departamento?: string;
  areas_pesquisa?: string | string[];
  biografia?: string;
};

type ProfessorFinal = ProfessorAPI & {
  foto: string;
  telefone: string;
  sala: string;
  bio: string;
  areasInteresse: string[];
  nome: string;
  projetos: ProjetoProfessor[];
};

// ---------------------------------------------
// COMPONENTE
// ---------------------------------------------

const PerfilProfessor = () => {
  const { id } = useParams();

  const [professor, setProfessor] = useState<ProfessorFinal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usuário logado mock (trocar pelo auth real)
  const usuarioLogadoId = localStorage.getItem("userId") || null;
  const userType = localStorage.getItem("userType") || null;

  // Mock adicional (enquanto backend não possui esses campos)
  const extraMockData = {
    foto: "/placeholder.svg",
    telefone: "(11) 99999-9999",
    sala: "Sala 205 - Bloco A",
    bio: "Biografia não cadastrada ainda.",
    areasInteresse: ["IA", "Machine Learning", "Web", "Educação"],
    formacao: [
      {
        titulo: "Doutorado em Ciência da Computação",
        instituicao: "USP",
        ano: "2011–2015",
      },
    ],
    estatisticas: {
      projetosAtivos: 2,
      alunosOrientados: 10,
      publicacoes: 5,
      citacoes: 120,
    },
  };

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const data = await apiGet(`https://icuspbackend.onrender.com/api/professor/${id}/`);

        // Mapear dados da API para o formato usado pelo componente
        const areasFromApi: string[] = [];
        if (data.areas_pesquisa) {
          if (Array.isArray(data.areas_pesquisa)) {
            areasFromApi.push(...data.areas_pesquisa.map(String));
          } else if (typeof data.areas_pesquisa === "string") {
            const raw = data.areas_pesquisa.trim();
            // tenta parsear JSON caso venha como "['a','b']" ou similar
            if (raw.startsWith("[") && raw.endsWith("]")) {
              try {
                const parsed = JSON.parse(raw.replace(/'/g, '"'));
                if (Array.isArray(parsed)) areasFromApi.push(...parsed.map(String));
              } catch {
                // fallback para CSV
                areasFromApi.push(...raw.split(",").map((s: string) => s.replace(/\[|\]|'/g, "").trim()).filter(Boolean));
              }
            } else {
              areasFromApi.push(...raw.split(",").map((s: string) => s.trim()).filter(Boolean));
            }
          }
        }

        const finalProf: ProfessorFinal = {
          ...data,
          ...extraMockData,
          nome: data.username,
          bio: data.biografia ?? extraMockData.bio,
          areasInteresse: areasFromApi.length > 0 ? areasFromApi : extraMockData.areasInteresse,
          projetos:
            data.iniciacoes?.map((i) => ({
              id: i.id,
              titulo: i.titulo,
              status: "Em andamento",
              alunos: 0,
              inicio: i.criado_em.slice(0, 4),
            })) ?? [],
        };

        setProfessor(finalProf);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [id]);

  if (loading)
    return <div className="text-white p-10 text-center">Carregando...</div>;

  if (error || !professor)
    return (
      <div className="text-white p-10 text-center">
        Erro ao carregar professor
      </div>
    );

  const isOwner = usuarioLogadoId == professor.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#141433] to-[#2a0b59] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Voltar */}
        <div className="mb-6">
          <Link to="/projetos">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-indigo-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos projetos</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <Card className="bg-white/10 border-white/10 backdrop-blur-xl shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32 ring-2 ring-indigo-400/40">
                <AvatarImage src={professor.foto} alt={professor.nome} />
                <AvatarFallback className="text-2xl bg-indigo-600/50 text-white">
                  {professor.nome[0]}
                </AvatarFallback>
              </Avatar>

              {/* Dados */}
              <div className="flex-1">
                <h1 className="text-indigo-100">{professor.nome}</h1>
                <p className="text-indigo-300 font-medium text-lg">
                  {professor.departamento ?? "Departamento não informado"}
                </p>

                {/* Contatos / Departamento / Áreas de Pesquisa */}
                <div className="mt-4 space-y-2 text-sm text-indigo-200">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {professor.email}
                  </div>

                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">{professor.departamento ?? "Departamento não informado"}</span>
                  </div>

                  <div className="flex items-start">
                    <BookOpen className="w-4 h-4 mr-2 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {professor.areasInteresse && professor.areasInteresse.length > 0 ? (
                        professor.areasInteresse.map((area, i) => (
                          <Badge key={i} className="bg-indigo-600/40 text-indigo-100 border border-indigo-400/40">
                            {area}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-indigo-200">Áreas de pesquisa não informadas</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  {userType === "aluno" && (
                    <Link to={`/chat/${professor.id}`}>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Iniciar Chat
                      </Button>
                    </Link>
                  )}

                  {/* EDITAR PERFIL — apenas se for o dono da página */}
                  {isOwner && (
                    <Link to={`/professor/${professor.id}/editar`}>
                      <Button className="bg-purple-700 hover:bg-purple-800 text-white shadow-lg">
                        Editar Perfil
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="sobre" className="space-y-6">
          <TabsList className="grid grid-cols-2 bg-white/10 border border-white/10">
            {["sobre", "projetos"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-indigo-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* SOBRE */}
          <TabsContent value="sobre">
            <Card className="bg-white/10 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-indigo-300 font-bold">
                  Biografia
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-white/80">{professor.bio}</p>




                <Separator className="my-6 bg-white/20" />

                <h3 className="text-indigo-300 font-bold mb-4">
                  Áreas de Interesse
                </h3>

                <div className="flex flex-wrap gap-2">
                  {professor.areasInteresse.map((area, i) => (
                    <Badge
                      key={i}
                      className="bg-indigo-600/40 text-indigo-100 border border-indigo-400/40"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROJETOS */}
          <TabsContent value="projetos">
            <div className="grid gap-6">
              {professor.projetos.map((p) => (
                <Card key={p.id} className="bg-white/10 border-white/10 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between text-indigo-300 font-bold">
                      <div>
                        <CardTitle className="text-xl">{p.titulo}</CardTitle>

                        <div className="flex gap-4 mt-1 text-sm text-indigo-100">
                          <Badge>{p.status}</Badge>
                          <span>{p.alunos} alunos</span>
                          <span>Início: {p.inicio}</span>
                        </div>
                      </div>

                      <Link to={`/projeto/${p.id}`}>
                        <Button className="bg-indigo-600 text-white">
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>



        </Tabs>
      </div>
    </div>
  );
};

export default PerfilProfessor;

