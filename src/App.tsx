import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import ProjetosIC from "./pages/ProjetosIC";
import DetalhesProjeto from "./pages/DetalhesProjeto";
import PerfilProfessor from "./pages/PerfilProfessor";
import Chat from "./pages/Chat";
import ChatColetivo from "./pages/ChatColetivo";
import AdicionarProjeto from "./pages/AdicionarProjeto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/projetos" element={<ProjetosIC />} />
          <Route path="/projeto/:id" element={<DetalhesProjeto />} />
          <Route path="/professor/:id" element={<PerfilProfessor />} />
          <Route path="/chat/:professorId" element={<Chat />} />
          <Route path="/chat-projeto/:projetoId" element={<ChatColetivo />} />
          <Route path="/adicionar-projeto" element={<AdicionarProjeto />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
