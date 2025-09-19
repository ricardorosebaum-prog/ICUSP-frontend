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

  // Mock data for professors
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Professor não encontrado</h2>
            <Link to="/projetos">
              <Button className="mt-4">Voltar aos projetos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/projetos">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos projetos</span>
            </Button>
          </Link>
        </div>

        {/* Header Profile */}
        <Card className="bg-gradient-card shadow-medium mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={professor.foto} alt={professor.nome} />
                <AvatarFallback className="text-2xl">
                  {professor.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {professor.nome}
                    </h1>
                    <p className="text-lg text-primary font-medium mb-1">
                      {professor.titulo}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      {professor.departamento}
                    </p>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
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
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link to={`/chat/${professor.id}`}>
                      <Button variant="hero" className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Iniciar Chat</span>
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Enviar Email</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{professor.estatisticas.projetosAtivos}</div>
              <div className="text-sm text-muted-foreground">Projetos Ativos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-accent mb-2" />
              <div className="text-2xl font-bold text-foreground">{professor.estatisticas.alunosOrientados}</div>
              <div className="text-sm text-muted-foreground">Alunos Orientados</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{professor.estatisticas.publicacoes}</div>
              <div className="text-sm text-muted-foreground">Publicações</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-4 text-center">
              <ExternalLink className="w-8 h-8 mx-auto text-accent mb-2" />
              <div className="text-2xl font-bold text-foreground">{professor.estatisticas.citacoes}</div>
              <div className="text-sm text-muted-foreground">Citações</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="sobre" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
            <TabsTrigger value="publicacoes">Publicações</TabsTrigger>
            <TabsTrigger value="formacao">Formação</TabsTrigger>
          </TabsList>

          <TabsContent value="sobre" className="space-y-6">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Biografia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {professor.bio}
                </p>
                
                <Separator className="my-6" />
                
                <h3 className="text-lg font-semibold mb-4">Áreas de Interesse</h3>
                <div className="flex flex-wrap gap-2">
                  {professor.areasInteresse.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projetos" className="space-y-6">
            <div className="grid gap-6">
              {professor.projetos.map((projeto) => (
                <Card key={projeto.id} className="bg-gradient-card shadow-soft">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{projeto.titulo}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge className={projeto.status === "Em andamento" ? 
                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                          }>
                            {projeto.status}
                          </Badge>
                          <span>{projeto.alunos} alunos</span>
                          <span>Início: {projeto.inicio}</span>
                        </div>
                      </div>
                      <Link to={`/projeto/${projeto.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="publicacoes" className="space-y-6">
            <div className="space-y-4">
              {professor.publicacoes.map((pub, index) => (
                <Card key={index} className="bg-gradient-card shadow-soft">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{pub.titulo}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{pub.revista}</span>
                      <span>{pub.ano}</span>
                      <Badge variant="outline">{pub.citacoes} citações</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formacao" className="space-y-6">
            <div className="space-y-4">
              {professor.formacao.map((form, index) => (
                <Card key={index} className="bg-gradient-card shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <GraduationCap className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{form.titulo}</h3>
                        <p className="text-muted-foreground">{form.instituicao}</p>
                        <p className="text-sm text-muted-foreground">{form.ano}</p>
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