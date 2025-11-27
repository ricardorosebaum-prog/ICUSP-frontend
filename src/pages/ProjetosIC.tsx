import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  BookOpen,
  Filter,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { apiGet } from "@/service/api";

interface ProjetoIC {
  id: number;
  titulo: string;
  area_pesquisa: string;
  descricao: string;
  duracao: string;
  status?: string;
  tags: string;
  tipo_bolsa?: string;
  numero_vagas?: number;
  bolsa_disponivel?: boolean;
  professor?: string;
}

const ProjetosIC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projetos, setProjetos] = useState<ProjetoIC[]>([]);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjetos() {
      try {
        const data = await apiGet("https://icuspbackend.onrender.com/api/iniciacao/listar/");
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
        return "bg-blue-500/20 text-blue-300";
      case "Concluído":
        return "bg-green-500/20 text-green-300";
      case "Recrutando":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p>Carregando projetos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* MESMO FUNDO DO INDEX */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6a5cff] via-[#3f4aff] to-[#2fb6ff] opacity-20" />

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-xl">
          Projetos de Iniciação Científica
        </h1>
        <p className="text-xl text-white/80 mb-10">
          Explore oportunidades de pesquisa e participe de projetos inovadores
        </p>

        {/* Botão Professor */}
        {userType === "professor" && (
          <Button
            onClick={() => navigate("/adicionar-projeto")}
            className="mb-8 bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] hover:opacity-90 shadow-xl"
          >
            + Adicionar Projeto
          </Button>
        )}

        {/* Barra de busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por título ou área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
            />
          </div>

          <Button
            className="border border-white/30 bg-white/5 text-white hover:bg-white/15 backdrop-blur-xl transition-all"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjetos.map((projeto) => (
            <Card
              key={projeto.id}
              className="bg-white/5 border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-xl hover:bg-white/10 transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge className={`${getStatusColor(projeto.status || "Recrutando")} px-3 py-1 rounded-full text-sm`}>
                    {projeto.status || "Recrutando"}
                  </Badge>

                  <Badge className="bg-white/10 border-white/20 text-white/80 px-3 py-1 rounded-full text-sm">
                    {projeto.area_pesquisa}
                  </Badge>
                </div>

                <CardTitle className="text-xl text-white leading-tight">
                  {projeto.titulo}
                </CardTitle>

                <CardDescription className="text-white/60 flex items-center mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {projeto.duracao}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-white/70 mb-4 line-clamp-3">
                  {projeto.descricao}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {projeto.tags &&
                    projeto.tags.split(",").slice(0, 3).map((tag, i) => (
                      <Badge
                        key={i}
                        className="bg-white/10 border-white/20 text-white/70 text-xs px-2 py-1 rounded-full"
                      >
                        {tag.trim()}
                      </Badge>
                    ))}
                </div>

                <Link to={`/projeto/${projeto.id}`}>
                  <Button
                    className="w-full bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] hover:opacity-90 shadow-xl"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjetos.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto text-white/40 mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-white/60">Tente ajustar os termos da busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjetosIC;
