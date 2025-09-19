import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  CheckCircle, 
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const DetalhesProjeto = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in a real app, you'd fetch this based on the ID
  const projeto = {
    id: 1,
    titulo: "Desenvolvimento de Algoritmos de Machine Learning para Análise de Dados Biomédicos",
    orientador: {
      nome: "Prof. Dr. Ana Silva",
      email: "ana.silva@universidade.edu.br",
      telefone: "(11) 9999-9999",
      departamento: "Departamento de Ciência da Computação"
    },
    area: "Inteligência Artificial",
    status: "Em andamento",
    duracao: "12 meses",
    inicioPrevisao: "Março 2024",
    vagasDisponiveis: 2,
    descricaoCompleta: `Este projeto de iniciação científica visa desenvolver e implementar algoritmos avançados de aprendizado de máquina 
    para análise e interpretação de dados biomédicos complexos. O foco principal será na criação de modelos preditivos 
    que possam auxiliar no diagnóstico precoce de doenças e na personalização de tratamentos médicos.

    O estudante terá a oportunidade de trabalhar com grandes volumes de dados médicos, aplicar técnicas de deep learning 
    e contribuir para pesquisas que podem ter impacto real na área da saúde. Este é um projeto multidisciplinar que 
    combina conhecimentos de computação, estatística e medicina.`,
    objetivos: [
      "Desenvolver algoritmos de ML para análise de dados biomédicos",
      "Implementar modelos preditivos para diagnóstico médico",
      "Validar a eficácia dos algoritmos desenvolvidos",
      "Publicar resultados em congressos científicos"
    ],
    requisitos: [
      "Conhecimento em programação Python",
      "Noções básicas de estatística e matemática",
      "Interesse em aplicações médicas da computação",
      "Disponibilidade de 20h semanais"
    ],
    beneficios: [
      "Bolsa de iniciação científica",
      "Certificado de participação",
      "Experiência em pesquisa científica",
      "Possibilidade de publicação em artigos"
    ],
    tags: ["Machine Learning", "Biomedicina", "Python", "TensorFlow", "Deep Learning", "Saúde Digital"]
  };

  const handleCandidatar = () => {
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura foi enviada com sucesso. O orientador entrará em contato em breve.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Concluído":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Recrutando":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/projetos">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos projetos</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge className={getStatusColor(projeto.status)}>
              {projeto.status}
            </Badge>
            <Badge variant="outline">{projeto.area}</Badge>
            <Badge variant="outline">
              {projeto.vagasDisponiveis} vagas disponíveis
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {projeto.titulo}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {projeto.orientador.nome}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {projeto.duracao}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Inicio: {projeto.inicioPrevisao}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Descrição do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {projeto.descricaoCompleta.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {projeto.objetivos.map((objetivo, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {projeto.requisitos.map((requisito, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{requisito}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Benefícios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {projeto.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle>Candidatar-se</CardTitle>
                <CardDescription>
                  Interessado neste projeto? Candidate-se agora!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={handleCandidatar}
                >
                  Enviar Candidatura
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Sua candidatura será enviada diretamente para o orientador
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Contato do Orientador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{projeto.orientador.nome}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{projeto.orientador.departamento}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{projeto.orientador.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{projeto.orientador.telefone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Tecnologias e Temas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projeto.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
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