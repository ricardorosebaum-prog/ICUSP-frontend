import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, BookOpen, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiGet } from "@/service/api";

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

const ProjetosIC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projetos, setProjetos] = useState<ProjetoIC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjetos() {
      try {
        const data = await apiGet("http://localhost:8000/api/iniciacao/listar/");
        setProjetos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjetos();
  }, []);

  const filteredProjetos = projetos.filter((projeto) => {
    const termo = searchTerm.toLowerCase();
    return (
      projeto.titulo?.toLowerCase().includes(termo) ||
      projeto.area_pesquisa?.toLowerCase().includes(termo)
    );
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando projetos...</p>
      </div>
    );
  }

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
                placeholder="Buscar por título ou área..."
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
                  <Badge className={getStatusColor(projeto.status || "Recrutando")}>
                    {projeto.status || "Recrutando"}
                  </Badge>
                  <Badge variant="outline">{projeto.area_pesquisa}</Badge>
                </div>

                <CardTitle className="text-lg leading-tight">
                  {projeto.titulo}
                </CardTitle>

                <CardDescription className="flex items-center space-x-4 text-sm text-muted-foreground">
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

                {/* Tags são string separada por vírgulas */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {projeto.tags &&
                    projeto.tags.split(",").slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
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
