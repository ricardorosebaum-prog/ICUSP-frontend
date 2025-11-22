import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { apiPostToken } from "@/service/api";

const AdicionarProjeto = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [projeto, setProjeto] = useState({
    titulo: "",
    area: "",
    descricao: "",
    objetivos: "",
    requisitos: "",
    duracao: "",
    vagas: 1,
    possuiBolsa: false,
    valorBolsa: "",
    agenciaFinanciadora: "",
    tags: ""
  });

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "professor") {
      toast({
        title: "Acesso negado",
        description: "Esta página é apenas acessível para professores.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        titulo: projeto.titulo,
        area_pesquisa: projeto.area,
        duracao: projeto.duracao,
        numero_vagas: projeto.vagas,
        descricao: projeto.descricao,
        bolsa_disponivel: projeto.possuiBolsa,
        tipo_bolsa: projeto.possuiBolsa ? projeto.agenciaFinanciadora : "",
        tags: projeto.tags,
      };

      await apiPostToken("http://localhost:8000/api/iniciacao/criar/", payload);

      toast({
        title: "Projeto criado com sucesso!",
        description: "Seu projeto foi publicado e está disponível.",
      });

      navigate("/projetos");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado.";
      toast({
        title: "Erro ao criar projeto",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* BACK BUTTON */}
        <div className="mb-8">
          <Link to="/projetos">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar aos projetos
            </Button>
          </Link>
        </div>

        {/* MAIN CARD */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>

              <div>
                <CardTitle className="text-3xl font-bold text-white">
                  Adicionar Projeto de IC
                </CardTitle>

                <CardDescription className="text-white/70 text-base">
                  Preencha as informações do seu novo projeto
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-white">Título do Projeto *</Label>
                <Input
                  id="titulo"
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                  placeholder="Ex: Desenvolvimento de Algoritmos de Machine Learning..."
                  value={projeto.titulo}
                  onChange={(e) => setProjeto({ ...projeto, titulo: e.target.value })}
                  required
                />
              </div>

              {/* Área & Duração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Área de Pesquisa *</Label>
                  <Input
                    className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                    placeholder="Ex: Inteligência Artificial"
                    value={projeto.area}
                    onChange={(e) => setProjeto({ ...projeto, area: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Duração *</Label>
                  <Input
                    className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                    placeholder="Ex: 12 meses"
                    value={projeto.duracao}
                    onChange={(e) => setProjeto({ ...projeto, duracao: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label className="text-white">Descrição *</Label>
                <Textarea
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                  value={projeto.descricao}
                  onChange={(e) => setProjeto({ ...projeto, descricao: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              {/* Objetivos */}
              <div className="space-y-2">
                <Label className="text-white">Objetivos</Label>
                <Textarea
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                  value={projeto.objetivos}
                  onChange={(e) => setProjeto({ ...projeto, objetivos: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Requisitos */}
              <div className="space-y-2">
                <Label className="text-white">Requisitos</Label>
                <Textarea
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                  value={projeto.requisitos}
                  onChange={(e) => setProjeto({ ...projeto, requisitos: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Vagas */}
              <div className="space-y-2">
                <Label className="text-white">Número de Vagas *</Label>
                <Input
                  type="number"
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                  value={projeto.vagas}
                  onChange={(e) => setProjeto({ ...projeto, vagas: parseInt(e.target.value) })}
                />
              </div>

              {/* Bolsa */}
              <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-lg">Possui Bolsa?</Label>
                    <p className="text-sm text-white/60">Marque se há bolsa disponível</p>
                  </div>

                  <Switch
                    checked={projeto.possuiBolsa}
                    onCheckedChange={(checked) => setProjeto({ ...projeto, possuiBolsa: checked })}
                  />
                </div>

                {projeto.possuiBolsa && (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <Label className="text-white">Valor da Bolsa</Label>
                      <Input
                        className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                        value={projeto.valorBolsa}
                        onChange={(e) => setProjeto({ ...projeto, valorBolsa: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Agência Financiadora</Label>
                      <Input
                        className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                        value={projeto.agenciaFinanciadora}
                        onChange={(e) => setProjeto({ ...projeto, agenciaFinanciadora: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-white">Tags</Label>
                <Input
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 backdrop-blur-md"
                  value={projeto.tags}
                  onChange={(e) => setProjeto({ ...projeto, tags: e.target.value })}
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Publicando..." : "Publicar Projeto"}
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate("/projetos")}
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                >
                  Cancelar
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdicionarProjeto;
