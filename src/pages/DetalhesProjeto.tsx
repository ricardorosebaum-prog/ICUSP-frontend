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
  MapPin,
  DollarSign,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { apiGet } from "@/service/api";

const DetalhesProjeto = () => {
  const { id } = useParams();
  const { toast } = useToast();
    const [projeto, setProjeto] = useState<ProjetoIC>();
    const [loading, setLoading] = useState(true);

  // Mock data - in a real app, you'd fetch this based on the ID


  interface ProjetoIC {
  id: number;
  titulo: string;
  area_pesquisa: string;
  descricao: string;
  duracao: string;
  status?: string;
  tags: string;      // vem como "tag1, tag2"
  tipo_bolsa?: string;
  numero_vagas?: number;
  bolsa_disponivel?: boolean;
  objetivos?: string;
  requisitos?: string;
  professor?: string;
  }

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

useEffect(() => {
  async function fetchProjetos() {
    try {
      const data = await apiGet(`http://localhost:8000/api/iniciacao/${id}/`);
      setProjeto(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao carregar projeto",
        description: "Não foi possível buscar os dados do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  fetchProjetos();
}, [id, toast]);

if (loading || !projeto) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Carregando...</p>
    </div>
  );
}

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
            <Badge variant="outline">{projeto.area_pesquisa}</Badge>
            <Badge variant="outline">
              {projeto.numero_vagas} vagas disponíveis
            </Badge>
            {projeto.bolsa_disponivel && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <DollarSign className="w-3 h-3 mr-1" />
                Com Bolsa
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {projeto.titulo}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {projeto.professor}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {projeto.duracao}
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
                  {projeto.descricao}
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
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {projeto.objetivos}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {projeto.requisitos}
                </div>
              </CardContent>
            </Card>

            {/* Bolsa Info */}
            {projeto.bolsa_disponivel && (
              <Card className="bg-gradient-card shadow-soft border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Informações sobre a Bolsa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Valor Mensal</span>
                    <span className="text-lg font-bold text-foreground">{projeto.tipo_bolsa}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Agência Financiadora</span>
                    <span className="text-sm font-medium text-foreground">{projeto.tipo_bolsa}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    A bolsa é concedida mediante aprovação e disponibilidade de recursos da agência financiadora.
                  </p>
                </CardContent>
              </Card>
            )}
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
                <Link to={`/chat-projeto/${id}`}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full mb-4"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Chat do Projeto
                  </Button>
                </Link>
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
                  <h4 className="font-semibold text-foreground mb-2">{projeto.professor}</h4>
                </div>
                
                <Separator />
                
                 <div className="space-y-3">
                   <div className="flex items-center">
                     <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">{projeto.professor}</span>
                   </div>
                   <div className="flex items-center">
                     <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">{projeto.professor}</span>
                   </div>
                 </div>
                 
                 <Separator />
                 
                 <Link to="/professor/1">
                   <Button variant="outline" className="w-full">
                     Ver Perfil Completo
                   </Button>
                 </Link>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Tecnologias e Temas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projeto.tags}
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