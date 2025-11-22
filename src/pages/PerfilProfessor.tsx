import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const PerfilProfessor = () => {
  const { id } = useParams();

  const professores = {
    "1": {
      id: "1",
      nome: "Prof. Dr. Ana Silva",
      titulo: "Doutora em Ciência da Computação",
      departamento: "Departamento de Ciência da Computação",
      universidade: "Universidade Federal de São Paulo",
      email: "ana.silva@universidade.edu.br",
      telefone: "(11) 9999-9999",
      sala: "Sala 205 - Bloco A",
      foto: "/placeholder.svg",
      bio: "Professora e pesquisadora especializada em Inteligência Artificial e Machine Learning com mais de 15 anos de experiência. Líder do Laboratório de IA Aplicada à Saúde, com foco em desenvolvimento de soluções tecnológicas para diagnóstico médico e análise de dados biomédicos.",
      areasInteresse: [
        "Machine Learning",
        "Deep Learning", 
        "Processamento de Linguagem Natural",
        "Computer Vision",
        "IA na Saúde",
        "Algoritmos Evolutivos"
      ],
      formacao: [
        {
          titulo: "Doutorado em Ciência da Computação",
          instituicao: "USP - Universidade de São Paulo",
          ano: "2010-2014"
        },
        {
          titulo: "Mestrado em Engenharia da Computação", 
          instituicao: "UNICAMP - Universidade Estadual de Campinas",
          ano: "2008-2010"
        },
        {
          titulo: "Graduação em Ciência da Computação",
          instituicao: "UNESP - Universidade Estadual Paulista",
          ano: "2004-2008"
        }
      ],
      publicacoes: [
        {
          titulo: "Machine Learning Applications in Medical Diagnosis: A Comprehensive Review",
          revista: "IEEE Transactions on Biomedical Engineering",
          ano: "2023",
          citacoes: 45
        },
        {
          titulo: "Deep Learning Models for Early Cancer Detection",
          revista: "Nature Machine Intelligence", 
          ano: "2022",
          citacoes: 78
        },
        {
          titulo: "Evolutionary Algorithms for Feature Selection in Medical Data",
          revista: "Journal of Artificial Intelligence Research",
          ano: "2021",
          citacoes: 32
        }
      ],
      projetos: [
        {
          id: 1,
          titulo: "Desenvolvimento de Algoritmos de Machine Learning para Análise de Dados Biomédicos",
          status: "Em andamento",
          alunos: 2,
          inicio: "2024"
        },
        {
          id: 5,
          titulo: "Sistema de Diagnóstico Automatizado por Imagens Médicas",
          status: "Recrutando",
          alunos: 0,
          inicio: "2024"
        }
      ],
      estatisticas: {
        projetosAtivos: 2,
        alunosOrientados: 15,
        publicacoes: 28,
        citacoes: 342
      }
    }
  };

  const professor = professores[id as keyof typeof professores];

  if (!professor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#141433] to-[#2a0b59] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Professor não encontrado</h2>
          <Link to="/projetos">
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              Voltar aos projetos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
                  {professor.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* Dados */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold">{professor.nome}</h1>
                <p className="text-indigo-300 font-medium text-lg">{professor.titulo}</p>
                <p className="text-purple-200/80">{professor.departamento}</p>

                {/* Contatos */}
                <div className="mt-4 space-y-2 text-sm text-indigo-200">
                  <div className="flex items-center"><Mail className="w-4 h-4 mr-2" />{professor.email}</div>
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-2" />{professor.telefone}</div>
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{professor.sala}</div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <Link to={`/chat/${professor.id}`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto font-semibold shadow-lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Iniciar Chat
                    </Button>
                  </Link>

                  <Button className="bg-purple-700 hover:bg-purple-800 text-white w-full md:w-auto font-semibold shadow-lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </Button>
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
            <Card key={i} className="bg-white/10 backdrop-blur-xl border-white/10 shadow-lg">
              <CardContent className="p-4 text-center">
                <item.icon className="w-8 h-8 mx-auto text-indigo-300 mb-2" />
                <div className="text-3xl font-bold">{item.value}</div>
                <div className="text-sm text-indigo-200">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sobre" className="space-y-6">

          {/* Lista de abas */}
          <TabsList className="grid grid-cols-4 bg-white/10 backdrop-blur-xl border border-white/10">
            {["sobre", "projetos", "publicacoes", "formacao"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-indigo-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Sobre */}
          <TabsContent value="sobre">
            <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-lg">
              <CardHeader><CardTitle>Biografia</CardTitle></CardHeader>
              <CardContent>
                <p className="text-indigo-100 leading-relaxed mb-6">{professor.bio}</p>
                <Separator className="my-6 bg-white/20" />

                <h3 className="text-lg font-semibold mb-4">Áreas de Interesse</h3>
                <div className="flex flex-wrap gap-2">
                  {professor.areasInteresse.map((area, i) => (
                    <Badge key={i} className="bg-indigo-600/40 text-indigo-100 border border-indigo-400/40">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projetos */}
          <TabsContent value="projetos">
            <div className="grid gap-6">
              {professor.projetos.map((p) => (
                <Card key={p.id} className="bg-white/10 backdrop-blur-xl border-white/10 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{p.titulo}</CardTitle>
                        <div className="flex gap-4 mt-1 text-sm text-indigo-200">
                          <Badge className="bg-indigo-600/40 text-indigo-100 border border-indigo-300/40">
                            {p.status}
                          </Badge>
                          <span>{p.alunos} alunos</span>
                          <span>Início: {p.inicio}</span>
                        </div>
                      </div>

                      <Link to={`/projeto/${p.id}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Publicações */}
          <TabsContent value="publicacoes">
            <div className="space-y-4">
              {professor.publicacoes.map((pub, i) => (
                <Card key={i} className="bg-white/10 backdrop-blur-xl border-white/10 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-1">{pub.titulo}</h3>
                    <div className="flex items-center gap-4 text-sm text-indigo-200">
                      <span>{pub.revista}</span>
                      <span>{pub.ano}</span>
                      <Badge className="bg-purple-600/40 text-purple-100 border border-purple-400/40">
                        {pub.citacoes} citações
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Formação */}
          <TabsContent value="formacao">
            <div className="space-y-4">
              {professor.formacao.map((form, i) => (
                <Card key={i} className="bg-white/10 backdrop-blur-xl border-white/10 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="w-6 h-6 text-indigo-300 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white">{form.titulo}</h3>
                        <p className="text-indigo-200">{form.instituicao}</p>
                        <p className="text-indigo-300 text-sm">{form.ano}</p>
                      </div>
                    </div>
                  </CardContent>
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