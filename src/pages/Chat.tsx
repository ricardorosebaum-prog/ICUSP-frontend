import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Mensagem {
  id: string;
  remetente: "aluno" | "professor";
  conteudo: string;
  timestamp: Date;
  lida: boolean;
}

const Chat = () => {
  const { professorId } = useParams();
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for professor
  const professor = {
    id: "1",
    nome: "Prof. Dr. Ana Silva",
    foto: "/placeholder.svg",
    status: "online",
    ultimaVezOnline: "Agora"
  };

  // Mock conversation data
  const conversaInicial: Mensagem[] = [
    {
      id: "1",
      remetente: "professor",
      conteudo: "Olá! Vi que você tem interesse no projeto de Machine Learning. Como posso ajudar?",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      lida: true
    },
    {
      id: "2", 
      remetente: "aluno",
      conteudo: "Olá professora! Tenho muito interesse na área de IA aplicada à saúde. Gostaria de saber mais sobre os requisitos do projeto.",
      timestamp: new Date(Date.now() - 3300000), // 55 min ago
      lida: true
    },
    {
      id: "3",
      remetente: "professor", 
      conteudo: "Ótimo! O projeto envolve desenvolvimento de algoritmos de deep learning para análise de imagens médicas. Você tem experiência com Python e TensorFlow?",
      timestamp: new Date(Date.now() - 3000000), // 50 min ago
      lida: true
    },
    {
      id: "4",
      remetente: "aluno",
      conteudo: "Sim, tenho conhecimento intermediário em Python e já fiz alguns projetos pessoais com TensorFlow. Também cursei disciplinas de estatística e cálculo.",
      timestamp: new Date(Date.now() - 2700000), // 45 min ago
      lida: true
    },
    {
      id: "5",
      remetente: "professor",
      conteudo: "Perfeito! Que tal marcarmos uma reunião para conversarmos melhor sobre o projeto? Posso te explicar todos os detalhes e responder suas dúvidas.",
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      lida: true
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
        remetente: "aluno",
        conteudo: mensagem,
        timestamp: new Date(),
        lida: false
      };
      
      setMensagens([...mensagens, novaMensagem]);
      setMensagem("");
      
      // Simulate professor response after 2 seconds
      setTimeout(() => {
        const respostaProfessor: Mensagem = {
          id: (Date.now() + 1).toString(),
          remetente: "professor",
          conteudo: "Obrigada pela mensagem! Vou analisar e responder em breve.",
          timestamp: new Date(),
          lida: false
        };
        setMensagens(prev => [...prev, respostaProfessor]);
      }, 2000);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={`/professor/${professorId}`}>
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao perfil</span>
            </Button>
          </Link>
        </div>

        {/* Chat Container */}
        <Card className="bg-gradient-card shadow-medium h-[600px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b bg-card/50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={professor.foto} alt={professor.nome} />
                    <AvatarFallback>
                      {professor.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                </div>
                <div>
                  <CardTitle className="text-lg">{professor.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {professor.status === "online" ? "Online agora" : professor.ultimaVezOnline}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {mensagens.map((msg, index) => {
                const mostrarData = index === 0 || 
                  formatarData(msg.timestamp) !== formatarData(mensagens[index - 1].timestamp);
                
                return (
                  <div key={msg.id}>
                    {mostrarData && (
                      <div className="flex justify-center mb-4">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {formatarData(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${msg.remetente === 'aluno' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.remetente === 'aluno' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-2xl ${
                          msg.remetente === 'aluno' 
                            ? 'bg-primary text-primary-foreground ml-2' 
                            : 'bg-muted mr-2'
                        }`}>
                          <p className="text-sm">{msg.conteudo}</p>
                        </div>
                        <div className={`text-xs text-muted-foreground mt-1 ${
                          msg.remetente === 'aluno' ? 'text-right' : 'text-left'
                        }`}>
                          {formatarHora(msg.timestamp)}
                        </div>
                      </div>
                      
                      {msg.remetente === 'professor' && (
                        <Avatar className="w-8 h-8 order-1">
                          <AvatarImage src={professor.foto} alt={professor.nome} />
                          <AvatarFallback className="text-xs">
                            {professor.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
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

export default Chat;