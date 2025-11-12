import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Send, 
  Paperclip,
  Smile,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Mensagem {
  id: string;
  remetente: string;
  tipo: "aluno" | "professor";
  conteudo: string;
  timestamp: Date;
  avatar?: string;
}

// Mock de projetos
const projetosMock: { [key: string]: { titulo: string; orientador: string } } = {
  "1": { titulo: "Machine Learning para Biomedicina", orientador: "Prof. Dr. Ana Silva" },
  "2": { titulo: "Sustentabilidade Industrial", orientador: "Prof. Dr. Carlos Santos" },
  "3": { titulo: "Apps para Educação Inclusiva", orientador: "Prof. Dra. Maria Oliveira" },
};

const ChatColetivo = () => {
  const { projetoId } = useParams<{ projetoId: string }>();
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userName = localStorage.getItem("userName") || "Visitante";
  const userType = localStorage.getItem("userType") || "aluno";
  
  const projeto = projetosMock[projetoId || "1"] || { 
    titulo: "Projeto Desconhecido", 
    orientador: "Orientador não identificado" 
  };

  // Mock conversation data específica do projeto
  const conversaInicial: Mensagem[] = [
    {
      id: "1",
      remetente: projeto.orientador,
      tipo: "professor",
      conteudo: `Bem-vindos ao chat do projeto "${projeto.titulo}"! Aqui podemos discutir sobre o andamento do projeto, tirar dúvidas e compartilhar resultados.`,
      timestamp: new Date(Date.now() - 7200000),
      avatar: "/placeholder.svg"
    },
    {
      id: "2", 
      remetente: "Maria Oliveira",
      tipo: "aluno",
      conteudo: "Obrigada! Estou muito empolgada para começar.",
      timestamp: new Date(Date.now() - 6900000),
      avatar: "/placeholder.svg"
    },
    {
      id: "3",
      remetente: projeto.orientador,
      tipo: "professor", 
      conteudo: "Ótimo! Vamos ter nossa primeira reunião na próxima semana para discutir os detalhes.",
      timestamp: new Date(Date.now() - 6600000),
      avatar: "/placeholder.svg"
    },
    {
      id: "4",
      remetente: "João Pedro Silva",
      tipo: "aluno",
      conteudo: "Professor, já podemos começar a revisar a bibliografia que foi indicada?",
      timestamp: new Date(Date.now() - 5400000),
      avatar: "/placeholder.svg"
    },
    {
      id: "5",
      remetente: projeto.orientador,
      tipo: "professor",
      conteudo: "Sim João, podem começar! Vou disponibilizar mais alguns artigos essa semana.",
      timestamp: new Date(Date.now() - 4800000),
      avatar: "/placeholder.svg"
    },
    {
      id: "6",
      remetente: "Lucas Ferreira",
      tipo: "aluno",
      conteudo: "Alguém tem dúvidas sobre a metodologia que vamos usar?",
      timestamp: new Date(Date.now() - 3600000),
      avatar: "/placeholder.svg"
    },
    {
      id: "7",
      remetente: "Fernanda Costa",
      tipo: "aluno",
      conteudo: "Eu tenho algumas dúvidas sobre a análise de dados. Podemos discutir na próxima reunião?",
      timestamp: new Date(Date.now() - 1800000),
      avatar: "/placeholder.svg"
    },
    {
      id: "8",
      remetente: projeto.orientador,
      tipo: "professor",
      conteudo: "Claro Fernanda! Vamos reservar um tempo na reunião para isso. Preparem suas questões.",
      timestamp: new Date(Date.now() - 900000),
      avatar: "/placeholder.svg"
    }
  ];

  useEffect(() => {
    setMensagens(conversaInicial);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const enviarMensagem = () => {
    if (mensagem.trim()) {
      const novaMensagem: Mensagem = {
        id: Date.now().toString(),
        remetente: userName,
        tipo: userType as "aluno" | "professor",
        conteudo: mensagem,
        timestamp: new Date(),
        avatar: "/placeholder.svg"
      };
      
      setMensagens([...mensagens, novaMensagem]);
      setMensagem("");
    }
  };

  const formatarHora = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatarData = (timestamp: Date) => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    if (timestamp.toDateString() === hoje.toDateString()) {
      return "Hoje";
    } else if (timestamp.toDateString() === ontem.toDateString()) {
      return "Ontem";
    } else {
      return timestamp.toLocaleDateString('pt-BR');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/projetos">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          </Link>
        </div>

        {/* Chat Container */}
        <Card className="bg-gradient-card shadow-medium h-[700px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b bg-card/50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">{projeto.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Chat do projeto - {projeto.orientador}
                  </p>
                </div>
              </div>
              
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </Badge>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {mensagens.map((msg, index) => {
                const mostrarData = index === 0 || 
                  formatarData(msg.timestamp) !== formatarData(mensagens[index - 1].timestamp);
                
                const isCurrentUser = msg.remetente === userName;
                
                return (
                  <div key={msg.id}>
                    {mostrarData && (
                      <div className="flex justify-center mb-4">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {formatarData(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isCurrentUser && (
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={msg.avatar} alt={msg.remetente} />
                            <AvatarFallback className="text-xs">
                              {getInitials(msg.remetente)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          {!isCurrentUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">
                                {msg.remetente}
                              </span>
                              {msg.tipo === "professor" && (
                                <Badge variant="secondary" className="text-xs">
                                  Professor
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className={`p-3 rounded-2xl ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground' 
                              : msg.tipo === "professor"
                              ? 'bg-accent/20 border border-accent/30'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{msg.conteudo}</p>
                          </div>
                          
                          <div className={`text-xs text-muted-foreground mt-1 ${
                            isCurrentUser ? 'text-right' : 'text-left'
                          }`}>
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

          {/* Message Input */}
          <div className="border-t p-4 bg-card/50 rounded-b-lg">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Smile className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  className="flex-1"
                />
                <Button 
                  onClick={enviarMensagem}
                  disabled={!mensagem.trim()}
                  size="sm"
                  className="px-3"
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