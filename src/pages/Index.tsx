import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-ic.jpg";

const Index = () => {
  const stats = [
    { label: "Projetos Ativos", value: "150+", icon: BookOpen },
    { label: "Estudantes Participando", value: "500+", icon: Users },
    { label: "Pesquisadores", value: "80+", icon: Award },
    { label: "Taxa de Sucesso", value: "95%", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Lightbulb,
      title: "Pesquisa Inovadora",
      description:
        "Participe de projetos de ponta que contribuem para o avanço científico e tecnológico.",
    },
    {
      icon: Target,
      title: "Orientação Especializada",
      description:
        "Trabalhe diretamente com professores doutores e pesquisadores experientes.",
    },
    {
      icon: Zap,
      title: "Desenvolvimento Prático",
      description:
        "Desenvolva habilidades técnicas e científicas através de experiência hands-on.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background global */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6a5cff] via-[#3f4aff] to-[#2fb6ff] opacity-20" />
      <Navbar />

      {/* HERO */}
      <section className="relative py-24 lg:py-40">
        {/* imagem escurecida */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* efeito glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6a5cff33] to-transparent blur-3xl opacity-50" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-xl">
            Explore o Futuro da
            <br />
            <span className="bg-gradient-to-r from-[#ffcf4b] to-[#ffe28a] bg-clip-text text-transparent">
              Iniciação Científica
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mt-6 max-w-3xl mx-auto">
            Conecte-se a pesquisas inovadoras e transforme sua jornada acadêmica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/projetos">
              <Button className="bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] hover:opacity-90 shadow-xl shadow-blue-500/30 px-8 py-6 text-lg">
                Explorar Projetos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 backdrop-blur-xl bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 mb-3">
                <stat.icon className="w-8 h-8 text-[#ffcf4b]" />
              </div>

              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
  <h2 className="text-center text-4xl font-extrabold mb-16">
    Por que escolher nossos projetos?
  </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {features.map((feature, i) => (
          <Card
            key={i}
            className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all shadow-xl shadow-blue-500/10"
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* AQUI ALTEREI O CONTRASTE */}
              <CardTitle className="text-white">
                {feature.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* AQUI TAMBÉM ALTEREI O CONTRASTE */}
              <CardDescription className="text-center text-white/80">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

      {/* PROJETOS DESTAQUE */}
{/* PROJETOS EM DESTAQUE */}
<section className="relative py-20 px-6 md:px-12 lg:px-20">
  {/* Título */}
  <div className="flex items-center justify-between mb-10">
    <div>
      <h2 className="text-4xl font-bold text-white drop-shadow-lg">Projetos em Destaque</h2>
      <p className="text-lg text-white/80 mt-2">
        Descubra pesquisas inovadoras prontas para você
      </p>
    </div>

    {/* Botão ver todos */}
    <button
      className="px-6 py-3 rounded-xl font-medium 
                 bg-white/10 text-white backdrop-blur-md
                 border border-white/20 shadow-lg
                 transition-all hover:bg-white/20 hover:shadow-xl"
    >
      Ver Todos →
    </button>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    
    {/* CARD 1 */}
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl
                    shadow-[0_0_35px_-5px_rgba(0,0,0,0.4)] transition-all hover:border-white/20">
      
      <div className="flex gap-3 mb-6">
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
          Inteligência Artificial
        </span>
        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
          Recrutando
        </span>
      </div>

      {/* Nome do projeto com alto contraste */}
      <h3 className="text-2xl font-bold text-white mb-2">
        Machine Learning para Biomedicina
      </h3>

      <p className="text-white/70 mb-6">Prof. Dr. Ana Silva</p>

      {/* BOTÃO */}
      <button
        className="w-full py-3 rounded-xl font-medium 
                   bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff]
                   text-white shadow-lg transition-all
                   hover:shadow-[0_0_20px_#6a5cff]"
      >
        Ver Detalhes
      </button>
    </div>

    {/* CARD 2 */}
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl
                    shadow-[0_0_35px_-5px_rgba(0,0,0,0.4)] transition-all hover:border-white/20">
      
      <div className="flex gap-3 mb-6">
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
          Engenharia Ambiental
        </span>
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
          Em andamento
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        Sustentabilidade Industrial
      </h3>

      <p className="text-white/70 mb-6">Prof. Dr. Carlos Santos</p>

      <button
        className="w-full py-3 rounded-xl font-medium 
                   bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff]
                   text-white shadow-lg transition-all
                   hover:shadow-[0_0_20px_#6a5cff]"
      >
        Ver Detalhes
      </button>
    </div>

    {/* CARD 3 */}
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl
                    shadow-[0_0_35px_-5px_rgba(0,0,0,0.4)] transition-all hover:border-white/20">
      
      <div className="flex gap-3 mb-6">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
          Tecnologia Educacional
        </span>
        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
          Recrutando
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        Apps para Educação Inclusiva
      </h3>

      <p className="text-white/70 mb-6">Prof. Dra. Maria Oliveira</p>

      <button
        className="w-full py-3 rounded-xl font-medium 
                   bg-gradient-to-r from-[#6a5cff] to-[#2fb6ff]
                   text-white shadow-lg transition-all
                   hover:shadow-[0_0_20px_#6a5cff]"
      >
        Ver Detalhes
      </button>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="py-14 bg-[#050b15] border-t border-white/10">
        <div className="text-center text-white/70">
          <div className="flex justify-center items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-[#ffcf4b]" />
            <span className="font-bold text-lg text-white">ICUSP</span>
          </div>

          <p>Conectando estudantes a oportunidades de pesquisa científica</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
