import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiGetToken } from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface MessageResp {
  id: number;
  remetente: number;
  remetente_username?: string;
  remetente_role?: string;
  destinatario: number;
  destinatario_username?: string;
  destinatario_role?: string;
  texto: string;
  criado_em: string;
}

interface Conversa {
  userId: number;
  username: string;
  role?: string;
  ultimaMensagem?: string;
  ultimaData?: string;
}

const ConversasList = () => {
  const { toast } = useToast();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : null;

  useEffect(() => {
    const fetchConversas = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        // Buscar todas as mensagens
        const all = (await apiGetToken(`http://localhost:8000/api/chat/listar/`)) as MessageResp[];

        // Extrair parceiros únicos — iterar de trás pra frente para pegar a mensagem mais recente primeiro
        const parceirosMap = new Map<number, Conversa>();

        // Inverter array para processar de trás pra frente (mais recente primeiro)
        const reversed = (all || []).reverse();

        reversed.forEach((msg) => {
          // Determinar quem é o parceiro
          let parceiro: Conversa | null = null;

          if (Number(msg.remetente) === currentUserId && msg.destinatario) {
            // Eu enviei a mensagem, parceiro é destinatario
            parceiro = {
              userId: msg.destinatario,
              username: msg.destinatario_username || `Usuário ${msg.destinatario}`,
              role: msg.destinatario_role,
              ultimaMensagem: msg.texto,
              ultimaData: msg.criado_em,
            };
          } else if (Number(msg.destinatario) === currentUserId && msg.remetente) {
            // Eu recebi a mensagem, parceiro é remetente
            parceiro = {
              userId: msg.remetente,
              username: msg.remetente_username || `Usuário ${msg.remetente}`,
              role: msg.remetente_role,
              ultimaMensagem: msg.texto,
              ultimaData: msg.criado_em,
            };
          }

          // Adicionar apenas se ainda não existe (primeira encontrada = mais recente)
          if (parceiro && !parceirosMap.has(parceiro.userId)) {
            parceirosMap.set(parceiro.userId, parceiro);
          }
        });

        const listaConversas = Array.from(parceirosMap.values());
        // Ordenar por data mais recente (redundante agora, mas mantém consistência)
        listaConversas.sort((a, b) => {
          const dateA = a.ultimaData ? new Date(a.ultimaData).getTime() : 0;
          const dateB = b.ultimaData ? new Date(b.ultimaData).getTime() : 0;
          return dateB - dateA;
        });

        setConversas(listaConversas);
      } catch (err) {
        console.error("Erro ao buscar conversas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as conversas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversas();
  }, [currentUserId, toast]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const formatarData = (s?: string) => {
    if (!s) return "";
    const dt = new Date(s);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (dt.toDateString() === hoje.toDateString()) return "Hoje";
    if (dt.toDateString() === ontem.toDateString()) return "Ontem";
    return dt.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-white/70">Faça login para ver suas conversas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/projetos">
            <Button variant="ghost" className="flex items-center space-x-2 text-white/80 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Conversas
          </h1>
          <p className="text-white/70 mt-1">{conversas.length} conversa{conversas.length !== 1 ? "s" : ""}</p>
        </div>

        {loading && (
          <div className="text-center text-white/70">
            <p>Carregando conversas...</p>
          </div>
        )}

        {!loading && conversas.length === 0 && (
          <div className="text-center text-white/70">
            <p>Você ainda não tem conversas.</p>
          </div>
        )}

        {!loading && conversas.length > 0 && (
          <div className="grid gap-4">
            {conversas.map((conversa) => (
              <Link key={conversa.userId} to={`/chat/${conversa.userId}`}>
                <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-white/20 hover:border-white/20 transition cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 flex-shrink-0">
                        <AvatarFallback className="text-sm font-semibold bg-white/20">
                          {getInitials(conversa.username)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {conversa.username}
                          </h3>
                          {conversa.ultimaData && (
                            <span className="text-xs text-white/60 flex-shrink-0">
                              {formatarData(conversa.ultimaData)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          {conversa.role === "professor" && (
                            <span className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded">
                              Professor
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-white/70 truncate">
                          {conversa.ultimaMensagem || "Nenhuma mensagem"}
                        </p>
                      </div>

                      <MessageCircle className="w-5 h-5 text-white/40 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversasList;
