import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Projeto criado com sucesso!",
        description: "Seu projeto de IC foi publicado e está disponível para candidaturas.",
      });
      setIsLoading(false);
      navigate("/projetos");
    }, 1500);
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

        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Adicionar Novo Projeto de IC</CardTitle>
                <CardDescription>
                  Preencha as informações do seu projeto de iniciação científica
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Projeto *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Desenvolvimento de Algoritmos de Machine Learning..."
                  value={projeto.titulo}
                  onChange={(e) => setProjeto({ ...projeto, titulo: e.target.value })}
                  required
                />
              </div>

              {/* Área e Duração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Área de Pesquisa *</Label>
                  <Input
                    id="area"
                    placeholder="Ex: Inteligência Artificial"
                    value={projeto.area}
                    onChange={(e) => setProjeto({ ...projeto, area: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração *</Label>
                  <Input
                    id="duracao"
                    placeholder="Ex: 12 meses"
                    value={projeto.duracao}
                    onChange={(e) => setProjeto({ ...projeto, duracao: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Projeto *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o projeto, seus objetivos principais e a metodologia a ser utilizada..."
                  value={projeto.descricao}
                  onChange={(e) => setProjeto({ ...projeto, descricao: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              {/* Objetivos */}
              <div className="space-y-2">
                <Label htmlFor="objetivos">Objetivos (um por linha)</Label>
                <Textarea
                  id="objetivos"
                  placeholder="Desenvolver algoritmos de ML&#10;Implementar modelos preditivos&#10;Validar a eficácia dos algoritmos"
                  value={projeto.objetivos}
                  onChange={(e) => setProjeto({ ...projeto, objetivos: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Requisitos */}
              <div className="space-y-2">
                <Label htmlFor="requisitos">Requisitos (um por linha)</Label>
                <Textarea
                  id="requisitos"
                  placeholder="Conhecimento em Python&#10;Noções de estatística&#10;Disponibilidade de 20h semanais"
                  value={projeto.requisitos}
                  onChange={(e) => setProjeto({ ...projeto, requisitos: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Vagas */}
              <div className="space-y-2">
                <Label htmlFor="vagas">Número de Vagas *</Label>
                <Input
                  id="vagas"
                  type="number"
                  min="1"
                  max="10"
                  value={projeto.vagas}
                  onChange={(e) => setProjeto({ ...projeto, vagas: parseInt(e.target.value) })}
                  required
                />
              </div>

              {/* Bolsa */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="possui-bolsa" className="text-base">
                      Possui Bolsa de IC?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Marque se o projeto oferece bolsa para os estudantes
                    </p>
                  </div>
                  <Switch
                    id="possui-bolsa"
                    checked={projeto.possuiBolsa}
                    onCheckedChange={(checked) => setProjeto({ ...projeto, possuiBolsa: checked })}
                  />
                </div>

                {projeto.possuiBolsa && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="valor-bolsa">Valor Mensal da Bolsa</Label>
                      <Input
                        id="valor-bolsa"
                        placeholder="Ex: R$ 400,00"
                        value={projeto.valorBolsa}
                        onChange={(e) => setProjeto({ ...projeto, valorBolsa: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência Financiadora</Label>
                      <Input
                        id="agencia"
                        placeholder="Ex: CNPq, FAPESP, CAPES"
                        value={projeto.agenciaFinanciadora}
                        onChange={(e) => setProjeto({ ...projeto, agenciaFinanciadora: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  placeholder="Ex: Machine Learning, Python, TensorFlow, Deep Learning"
                  value={projeto.tags}
                  onChange={(e) => setProjeto({ ...projeto, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Use tags para facilitar a busca do seu projeto
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Publicando..." : "Publicar Projeto"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/projetos")}
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