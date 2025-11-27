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

type Formacao = {
  titulo: string;
  instituicao: string;
  ano: string;
};

type Estatisticas = {
  projetosAtivos: number;
  alunosOrientados: number;
  publicacoes: number;
  citacoes: number;
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
};

type ProfessorFinal = ProfessorAPI & {
  foto: string;
  telefone: string;
  sala: string;
  bio: string;
  areasInteresse: string[];
  formacao: Formacao[];
  estatisticas: Estatisticas;
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
        const data = await apiGet(`http://127.0.0.1:8000/api/professor/${id}/`);

        const finalProf: ProfessorFinal = {
          ...data,
          ...extraMockData,
          nome: data.username,
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

                {/* Contatos */}
                <div className="mt-4 space-y-2 text-sm text-indigo-200">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {professor.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {professor.telefone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {professor.sala}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <Link to={`/chat/${professor.id}`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Iniciar Chat
                    </Button>
                  </Link>

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

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: "Projetos Ativos", value: professor.estatisticas.projetosAtivos },
            { icon: Users, label: "Alunos Orientados", value: professor.estatisticas.alunosOrientados },
            { icon: Award, label: "Publicações", value: professor.estatisticas.publicacoes },
            { icon: ExternalLink, label: "Citações", value: professor.estatisticas.citacoes },
          ].map((item, i) => (
            <Card key={i} className="bg-white/10 border-white/10 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4 text-center">
                <item.icon className="w-8 h-8 mx-auto text-indigo-300 mb-2" />
                <div className="text-3xl text-white font-bold">{item.value}</div>
                <div className="text-sm text-indigo-100">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sobre" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-white/10 border border-white/10">
            {["sobre", "projetos", "formacao"].map((tab) => (
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

                {isOwner && (
                  <Link to={`/professor/${professor.id}/editar#bio`}>
                    <Button className="mt-4 bg-indigo-600 text-white">
                      Editar Biografia
                    </Button>
                  </Link>
                )}

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

          {/* FORMAÇÃO */}
          <TabsContent value="formacao">
            <div className="space-y-4">
              {professor.formacao.map((form, i) => (
                <Card key={i} className="bg-white/10 border-white/10 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="w-6 h-6 text-indigo-300 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white">{form.titulo}</h3>
                        <p className="text-indigo-100">{form.instituicao}</p>
                        <p className="text-indigo-50 text-sm">{form.ano}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isOwner && (
              <Link to={`/professor/${professor.id}/editar#formacao`}>
                <Button className="mt-4 bg-indigo-600 text-white">
                  Editar Formação
                </Button>
              </Link>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerfilProfessor;

