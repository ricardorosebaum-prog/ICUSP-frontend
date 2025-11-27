import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Paperclip, Smile, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import {apiGet, apiPostToken } from "@/service/api"; 
import { toast } from "@/components/ui/use-toast";


interface Mensagem {
  id: string;
  remetente: string;
  tipo: "aluno" | "professor" | "outro";
  conteudo: string;
  timestamp: Date;
  avatar?: string;
}

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
    objetivos?: string | null;
    requisitos?: string | null;
    professor?: ProfessorData | null;
  }

  interface ProfessorData {
    id: number;
    username: string;
    email: string;
  }

  interface ProfessorData {
    id: number;
    autor: string;
    texto: string;
    criado_em: string;
    post: number;
  }

const ChatColetivo = () => {
  const { projetoId } = useParams<{ projetoId: string }>();
  const projectId = projetoId ?? "1";
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<number | null>(null);

  const userName = localStorage.getItem("userName") || "Visitante";
  const userType = (localStorage.getItem("userType") as "aluno" | "professor" | null) || "aluno";
  const userId = localStorage.getItem("userId") || null;

  const [projeto, setProjeto] = useState<ProjetoIC>(null);
  const [loadingProjeto, setLoadingProjeto] = useState(true);

   useEffect(() => {
    async function fetchProjeto() {
      try {
        const data = await apiGet(`https://icuspbackend.onrender.com/api/iniciacao/${projetoId}/`);
        setProjeto(data);
      } catch (err) {
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível buscar os dados.",
          variant: "destructive",
        });
      } finally {
        setLoadingProjeto(false);
      }
    }
    fetchProjeto();
  }, [projetoId]);


  // converte mensagem da API para o formato local
  const parseApiMessage = (m: ProfessorData): Mensagem => {
    // m: { id, autor: "Nome (aluno)", texto, criado_em, post }
    const autorStr: string = m.autor || "Anon";
    // tenta extrair (aluno) ou (professor)
    const tipoMatch = autorStr.match(/\((aluno|professor)\)/i);
    const tipo = tipoMatch ? (tipoMatch[1].toLowerCase() as "aluno" | "professor") : "outro";
    const nome = autorStr.replace(/\s*\((aluno|professor)\)\s*$/i, "").trim() || "Anon";

    return {
      id: String(m.id),
      remetente: nome,
      tipo,
      conteudo: m.texto,
      timestamp: new Date(m.criado_em),
      avatar: undefined,
    };
  };

  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    const payload = {
      post: Number(projectId),
    };
    setLoading(true);
    try {
      const url = `https://icuspbackend.onrender.com/api/mensagem/listar/`;
      const data = await apiPostToken(url, payload);
      // espera array
      if (Array.isArray(data)) {
        const parsed = data.map(parseApiMessage);
        // ordenar por timestamp caso backend não venha ordenado
        parsed.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        setMensagens(parsed);
      } else {
        console.warn("Resposta inesperada listar mensagens:", data);
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMessages();

    // polling
    const id = window.setInterval(() => {
      fetchMessages();
    }, 3000);
    pollRef.current = id;

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [fetchMessages]);

  // auto-scroll removed — do not force scroll when mensagens update

  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;
    setSending(true);

    const payload = {
      post: Number(projectId),
      texto: mensagem.trim(),
      autor: Number(userId)
    };

    try {
      const res = await apiPostToken("https://icuspbackend.onrender.com/api/mensagem/criar/", payload);
      // backend retorna a mensagem criada — vamos adicioná-la (ou re-fetch)
      // Preferimos re-fetch para garantir consistência
      setMensagem("");
      await fetchMessages();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      alert("Não foi possível enviar a mensagem. Verifique se você está logado.");
    } finally {
      setSending(false);
    }
  };

  const formatarHora = (timestamp: Date) =>
    timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const formatarData = (timestamp: Date) => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (timestamp.toDateString() === hoje.toDateString()) return "Hoje";
    if (timestamp.toDateString() === ontem.toDateString()) return "Ontem";
    return timestamp.toLocaleDateString("pt-BR");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/projetos">
            <Button variant="ghost" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl h-[700px] flex flex-col">
          <CardHeader className="bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">{projeto?.titulo}</CardTitle>
                  <p className="text-sm text-white/70">Chat do projeto - {projeto?.professor?.username}</p>
                </div>
              </div>

              <Badge className="bg-white/10 text-white/80 border border-white/20 px-3 py-1 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">Online</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {loading && mensagens.length === 0 && (
                <div className="text-sm text-white/70">Carregando mensagens...</div>
              )}

              {mensagens.map((msg, index) => {
                const mostrarData =
                  index === 0 || formatarData(msg.timestamp) !== formatarData(mensagens[index - 1].timestamp);

                const isCurrentUser = msg.remetente === userName;

                return (
                  <div key={msg.id}>
                    {mostrarData && (
                      <div className="flex justify-center mb-4">
                        <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
                          {formatarData(msg.timestamp)}
                        </span>
                      </div>
                    )}

                    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[75%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                        {!isCurrentUser && (
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={msg.avatar ?? "/placeholder.svg"} alt={msg.remetente} />
                            <AvatarFallback className="text-xs">{getInitials(msg.remetente)}</AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                          {!isCurrentUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{msg.remetente}</span>
                              {msg.tipo === "professor" && <Badge className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-md">Professor</Badge>}
                            </div>
                          )}

                          <div
                            className={`p-3 rounded-2xl ${
                              isCurrentUser
                                ? "bg-white/20 text-white"
                                : msg.tipo === "professor"
                                ? "bg-white/10 border border-white/10"
                                : "bg-white/5"
                            }`}
                          >
                            <p className="text-sm text-white/90">{msg.conteudo}</p>
                          </div>

                          <div className={`text-xs text-white/70 mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                            {formatarHora(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="border-t border-white/10 p-4 bg-white/5 rounded-b-lg">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2 rounded-md">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2 rounded-md">
                <Smile className="w-4 h-4" />
              </Button>

              <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviarMensagem();
                    }
                  }}
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm rounded-lg px-3 py-2"
                />
                <Button
                  onClick={enviarMensagem}
                  disabled={!mensagem.trim() || sending}
                  size="sm"
                  className="px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatColetivo;
