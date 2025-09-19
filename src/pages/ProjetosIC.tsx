import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, BookOpen, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";

const ProjetosIC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for IC projects
  const projetos = [
    {
      id: 1,
      titulo: "Desenvolvimento de Algoritmos de Machine Learning para Análise de Dados Biomédicos",
      orientador: "Prof. Dr. Ana Silva",
      area: "Inteligência Artificial",
      status: "Em andamento",
      duracao: "12 meses",
      descricao: "Pesquisa focada no desenvolvimento de algoritmos de aprendizado de máquina para análise e interpretação de dados biomédicos complexos.",
      tags: ["Machine Learning", "Biomedicina", "Python", "TensorFlow"]
    },
    {
      id: 2,
      titulo: "Sustentabilidade Ambiental em Processos Industriais",
      orientador: "Prof. Dr. Carlos Santos",
      area: "Engenharia Ambiental",
      status: "Concluído",
      duracao: "18 meses",
      descricao: "Estudo sobre implementação de práticas sustentáveis em processos industriais para redução do impacto ambiental.",
      tags: ["Sustentabilidade", "Meio Ambiente", "Indústria", "Química Verde"]
    },
    {
      id: 3,
      titulo: "Desenvolvimento de Aplicativos Móveis para Educação Inclusiva",
      orientador: "Prof. Dra. Maria Oliveira",
      area: "Tecnologia Educacional",
      status: "Em andamento",
      duracao: "10 meses",
      descricao: "Criação de aplicativos móveis para apoiar a educação inclusiva de crianças com necessidades especiais.",
      tags: ["Educação", "Mobile", "Inclusão", "React Native"]
    },
    {
      id: 4,
      titulo: "Análise de Redes Sociais e Comportamento Digital",
      orientador: "Prof. Dr. João Costa",
      area: "Ciências Sociais",
      status: "Recrutando",
      duracao: "14 meses",
      descricao: "Pesquisa sobre padrões de comportamento em redes sociais e seu impacto na sociedade contemporânea.",
      tags: ["Redes Sociais", "Comportamento", "Análise de Dados", "Sociologia"]
    }
  ];

  const filteredProjetos = projetos.filter(projeto =>
    projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.orientador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Projetos de Iniciação Científica
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Explore oportunidades de pesquisa e participe de projetos inovadores
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por título, orientador ou área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjetos.map((projeto) => (
            <Card key={projeto.id} className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getStatusColor(projeto.status)}>
                    {projeto.status}
                  </Badge>
                  <Badge variant="outline">{projeto.area}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {projeto.titulo}
                </CardTitle>
                <CardDescription className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {projeto.orientador}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {projeto.duracao}
                  </span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {projeto.descricao}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {projeto.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {projeto.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{projeto.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Link to={`/projeto/${projeto.id}`}>
                  <Button variant="hero" size="sm" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjetos.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar seus termos de busca ou filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjetosIC;