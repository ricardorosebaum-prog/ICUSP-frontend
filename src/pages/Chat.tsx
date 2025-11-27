// src/pages/Chat.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiGetToken, apiPostToken } from "@/service/api";
import { useToast } from "@/hooks/use-toast";

type MessageResp = {
  id: number;
  remetente: number;
  remetente_username?: string;
  remetente_role?: string;
  destinatario: number;
  destinatario_username?: string;
  destinatario_role?: string;
  texto: string;
  criado_em: string;
};

type UserBrief = {
  id: number;
  username?: string;
  email?: string;
  foto?: string | null;
  role?: string;
};

const Chat = () => {
  const { professorId } = useParams<{ professorId: string }>();
  const { toast } = useToast();

  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<MessageResp[]>([]);
  const [partner, setPartner] = useState<UserBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchPartnerFromMessages = (msgs: MessageResp[]) => {
    for (const m of msgs) {
      if (`${m.remetente}` === professorId && m.remetente_username) {
        return { id: m.remetente, username: m.remetente_username, role: m.remetente_role };
      }
      if (`${m.destinatario}` === professorId && m.destinatario_username) {
        return { id: m.destinatario, username: m.destinatario_username, role: m.destinatario_role };
      }
    }
    return null;
  };

  const loadMessages = useCallback(async () => {
    if (!professorId) return;

    try {
      // Depuração: indicar que vamos chamar o endpoint de listagem
      console.debug("Chat.loadMessages -> chamando /api/chat/listar/", { professorId });
      // Lista todas as mensagens do backend e filtramos localmente
      const all = (await apiGetToken(`https://icuspbackend.onrender.com/api/chat/listar/`)) as MessageResp[];

      // Mostrar apenas mensagens que envolvem o professor cujo id veio por parâmetro
      const filtered = (all || []).filter(
        (m) => Number(m.destinatario) === Number(professorId) || Number(m.remetente) === Number(professorId)
      );

      setMensagens(filtered);

      // Se ainda não temos os dados do parceiro, tentamos buscar pelo próprio userId (é o professor)
      if (!partner) {
        const currentUserId = localStorage.getItem("userId")
          ? Number(localStorage.getItem("userId"))
          : null;

        let inferred: UserBrief | null = null;

        if (filtered.length > 0) {
          for (const m of filtered) {
            // se sabemos o id do usuário logado, o parceiro é a outra ponta da mensagem
            if (currentUserId !== null) {
              if (Number(m.remetente) !== currentUserId) {
                inferred = { id: m.remetente, username: m.remetente_username, role: m.remetente_role };
                break;
              }
              if (Number(m.destinatario) !== currentUserId) {
                inferred = { id: m.destinatario, username: m.destinatario_username, role: m.destinatario_role };
                break;
              }
            } else {
              // fallback: usar professorId param (rota espera professor)
              if (`${m.remetente}` === professorId && m.remetente_username) {
                inferred = { id: m.remetente, username: m.remetente_username, role: m.remetente_role };
                break;
              }
              if (`${m.destinatario}` === professorId && m.destinatario_username) {
                inferred = { id: m.destinatario, username: m.destinatario_username, role: m.destinatario_role };
                break;
              }
            }
          }
        }

        if (inferred) {
          setPartner(inferred);
        } else {
          // último recurso: tentar buscar via endpoint do professor (mantendo compatibilidade atual)
          try {
            const userData = await apiGetToken(`https://icuspbackend.onrender.com/api/professor/${professorId}/`);
            setPartner({
              id: userData.id,
              username: userData.username || userData.nome || undefined,
              email: userData.email,
              foto: userData.foto || userData.avatar || null,
              role: userData.role,
            });
          } catch (e) {
            console.warn("Não foi possível obter dados do usuário parceiro:", e);
          }
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens.",
        variant: "destructive",
      });

      setLoading(false);
    }
  }, [professorId, partner, toast]);



const tryFetchUser = useCallback(async () => {
  if (!professorId) return;
  try {
    const u = await apiGetToken(`https://icuspbackend.onrender.com/api/professor/${professorId}/`);
    if (u) {
      setPartner({
        id: u.id,
        username: u.username || u.nome || undefined,
        email: u.email,
        foto: u.foto || u.avatar || null,
        role: u.role,
      });
    }
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
  }
}, [professorId]);

  const getErrorMessage = (e: unknown) => {
    if (!e) return "";
    if (typeof e === "string") return e;
    if (e instanceof Error) return e.message;
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  };

useEffect(() => {
  if (!professorId) {
    setLoading(false);
    return;
  }

  loadMessages();
  tryFetchUser();

  pollRef.current = window.setInterval(() => {
    loadMessages();
  }, 3000);

  return () => {
    if (pollRef.current) window.clearInterval(pollRef.current);
  };
}, [professorId, loadMessages, tryFetchUser]);


  // removed automatic scrolling on messages updates per user request

  const getCurrentUserId = () => {
    return localStorage.getItem("userId")
      ? Number(localStorage.getItem("userId"))
      : null;
  };

  const parseCriadoEm = (s?: string) => {
    if (!s) return new Date();
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;

    // tenta formato BR: DD/MM/YYYY HH:mm
    const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (m) {
      const day = Number(m[1]);
      const month = Number(m[2]) - 1;
      const year = Number(m[3]);
      const hour = m[4] ? Number(m[4]) : 0;
      const minute = m[5] ? Number(m[5]) : 0;
      return new Date(year, month, day, hour, minute);
    }

    // fallback
    return new Date(s);
  };

  const formatarHora = (dt: Date) =>
    dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const formatarData = (dt: Date) => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (dt.toDateString() === hoje.toDateString()) return "Hoje";
    if (dt.toDateString() === ontem.toDateString()) return "Ontem";
    return dt.toLocaleDateString("pt-BR");
  };

  const enviarMensagem = async () => {
    if (!mensagem.trim() || !professorId) return;
    setSending(true);

    try {
      console.debug("Chat.enviarMensagem -> enviando para /api/chat/enviar/", { destinatario: professorId, texto: mensagem });
      const created = await apiPostToken(`https://icuspbackend.onrender.com/api/chat/enviar/`, {
        destinatario: Number(professorId),
        texto: mensagem.trim(),
      });

      setMensagens((prev) => [...prev, created as MessageResp]);

      if (!partner) {
        const p = fetchPartnerFromMessages([created as MessageResp]);
        if (p) setPartner(p);
      }

      setMensagem("");
    } catch (err: unknown) {
      console.error("Erro ao enviar mensagem:", err);
      const msg = getErrorMessage(err) || "Erro ao enviar a mensagem.";
      toast({
        title: "Erro",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p>Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a041f] via-[#120a2b] to-[#1b0f3a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to={"/conversas"}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para conversas</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl h-[700px] flex flex-col">
          <CardHeader className="bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-full flex items-center justify-center">
                  <Avatar className="w-12 h-12">
                    {partner?.foto ? (
                      <AvatarImage src={partner.foto} alt={partner?.username} />
                    ) : (
                      <AvatarFallback className="text-sm">
                        {partner?.username
                          ? partner.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div>
                  <CardTitle className="text-lg text-white">{partner?.username || `Usuário ${professorId}`}</CardTitle>
                  <p className="text-sm text-white/70">{partner?.role === "professor" ? "Professor" : partner?.role === "aluno" ? "Aluno" : ""}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="bg-white/10 text-white/80 border border-white/10">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-white/10 text-white/80 border border-white/10">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {mensagens.length === 0 && (
                <div className="text-center text-white/70">
                  Nenhuma mensagem ainda. Seja o primeiro a escrever.
                </div>
              )}

              {mensagens.map((msg, index) => {
                const currentUserId = getCurrentUserId();
                const isMine = currentUserId ? Number(msg.remetente) === currentUserId : false;
                const remetenteNome = msg.remetente_username || (isMine ? "Você" : partner?.username || "Usuário");
                const papel = msg.remetente_role === "professor" ? "professor" : msg.remetente_role === "aluno" ? "aluno" : "outro";

                const dt = parseCriadoEm(msg.criado_em);
                const prevDt = index > 0 ? parseCriadoEm(mensagens[index - 1].criado_em) : null;
                const mostrarData = index === 0 || (prevDt && formatarData(dt) !== formatarData(prevDt));
                const hora = formatarHora(dt);

                return (
                  <div key={msg.id}>
                    {mostrarData && (
                      <div className="flex justify-center mb-4">
                        <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">{formatarData(dt)}</span>
                      </div>
                    )}

                    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                        {!isMine && (
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {remetenteNome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                          {!isMine && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{remetenteNome}</span>
                              {papel === "professor" && (
                                <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-md">Professor</span>
                              )}
                            </div>
                          )}

                          <div
                            className={`p-3 rounded-2xl ${
                              isMine
                                ? "bg-white/20 text-white"
                                : papel === "professor"
                                ? "bg-white/12 text-white border border-white/10"
                                : "bg-white/10 text-white/90"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                          </div>

                          <div className={`text-xs text-white/70 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                            {hora}
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
                  onKeyPress={onKeyPress}
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

export default Chat;
