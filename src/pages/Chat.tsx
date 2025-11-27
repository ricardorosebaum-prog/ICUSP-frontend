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
  const { userId } = useParams<{ userId: string }>();
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
      if (`${m.remetente}` === userId && m.remetente_username) {
        return { id: m.remetente, username: m.remetente_username, role: m.remetente_role };
      }
      if (`${m.destinatario}` === userId && m.destinatario_username) {
        return { id: m.destinatario, username: m.destinatario_username, role: m.destinatario_role };
      }
    }
    return null;
  };

const loadMessages = async () => {
  if (!userId) return;

  try {
    const data = await apiGetToken(`http://localhost:8000/api/chat/${userId}/`);
    setMensagens(data as MessageResp[]);

    // identificar id do outro participante
    const otherId = data
      ?.map((m: any) => m.sender)
      .find((id: number) => id !== Number(userId));

    // buscar o usuário do outro lado
    if (otherId && !partner) {
      const userData = await apiGetToken(`http://localhost:8000/api/users/${otherId}/`);
      setPartner(userData);
    }

    setLoading(false);
    setTimeout(scrollToBottom, 50);

  } catch (err) {
    console.error("Erro ao carregar mensagens:", err);
    toast({
      title: "Erro",
      description: "Não foi possível carregar as mensagens.",
      variant: "destructive",
    });

    setLoading(false);
  }
};



const tryFetchUser = async () => {
  if (!userId) return;
  try {
    const u = await apiGetToken(`http://localhost:8000/api/users/${userId}/`);
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
};

useEffect(() => {
  if (!userId) {
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
}, [userId]);


  useEffect(() => {
    scrollToBottom();
  }, [mensagens, scrollToBottom]);

  const getCurrentUserId = () => {
    return localStorage.getItem("userId")
      ? Number(localStorage.getItem("userId"))
      : null;
  };

  const enviarMensagem = async () => {
    if (!mensagem.trim() || !userId) return;
    setSending(true);

    try {
      const created = await apiPostToken(
        `http://localhost:8000/api/chat/send/`,
        {
          destinatario: Number(userId),
          texto: mensagem.trim(),
        }
      );

      setMensagens((prev) => [...prev, created as MessageResp]);

      if (!partner) {
        const p = fetchPartnerFromMessages([created as MessageResp]);
        if (p) setPartner(p);
      }

      setMensagem("");
      setTimeout(scrollToBottom, 50);
    } catch (err: any) {
      console.error("Erro ao enviar mensagem:", err);
      toast({
        title: "Erro",
        description: err.message || "Erro ao enviar a mensagem.",
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
          <Link to={partner ? `/professor/${partner.id}` : "/projetos"}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao perfil</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-gradient-card shadow-medium h-[720px] flex flex-col rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-card/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center">
                  <Avatar className="w-12 h-12">
                    {partner?.foto ? (
                      <AvatarImage src={partner.foto} alt={partner.username} />
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
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                </div>

                <div>
                  <CardTitle className="text-lg">
                    {partner?.username || `Usuário ${userId}`}
                  </CardTitle>
                  <p className="text-sm text-white/70">
                    {partner?.role === "professor"
                      ? "Professor"
                      : partner?.role === "aluno"
                      ? "Aluno"
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white/80">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80">
                  <MoreVertical className="w-4 h-4" />
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

              {mensagens.map((msg) => {
                const currentUserId = getCurrentUserId();
                const isMine = currentUserId
                  ? Number(msg.remetente) === currentUserId
                  : false;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] ${
                        isMine ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-2xl ${
                          isMine
                            ? "bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] text-white"
                            : "bg-white/7 text-white/90"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.texto}
                        </p>
                      </div>
                      <div
                        className={`text-xs mt-1 text-white/60 ${
                          isMine ? "pr-1" : "pl-1"
                        }`}
                      >
                        {msg.criado_em}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="border-t p-4 bg-card/20">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white/80">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80">
                <Smile className="w-4 h-4" />
              </Button>

              <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyPress={onKeyPress}
                  className="flex-1 text-black/60 placeholder-white/60"
                />
                <Button
                  onClick={enviarMensagem}
                  disabled={!mensagem.trim() || sending}
                  size="sm"
                  className="px-3 bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] text-white"
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
