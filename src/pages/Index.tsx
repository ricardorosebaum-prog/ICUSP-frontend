import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight
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
      description: "Participe de projetos de ponta que contribuem para o avanço científico e tecnológico."
    },
    {
      icon: Target,
      title: "Orientação Especializada",
      description: "Trabalhe diretamente com professores doutores e pesquisadores experientes."
    },
    {
      icon: Zap,
      title: "Desenvolvimento Prático",
      description: "Desenvolva habilidades técnicas e científicas através de experiência hands-on."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Transforme seu futuro com
              <br />
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Iniciação Científica
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Conecte-se com projetos de pesquisa inovadores e desenvolva suas habilidades 
              científicas ao lado dos melhores orientadores.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projetos">
                <Button variant="accent" size="xl" className="group">
                  Explorar Projetos
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero" size="xl" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary">
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que escolher nossos projetos?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma experiência completa de iniciação científica com foco 
              no desenvolvimento profissional e acadêmico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-0">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Projetos em Destaque
              </h2>
              <p className="text-xl text-muted-foreground">
                Descubra algumas das pesquisas mais interessantes disponíveis
              </p>
            </div>
            <Link to="/projetos">
              <Button variant="outline" className="hidden sm:flex items-center">
                Ver Todos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Machine Learning para Biomedicina",
                area: "Inteligência Artificial",
                orientador: "Prof. Dr. Ana Silva",
                status: "Recrutando"
              },
              {
                title: "Sustentabilidade Industrial",
                area: "Engenharia Ambiental",
                orientador: "Prof. Dr. Carlos Santos",
                status: "Em andamento"
              },
              {
                title: "Apps para Educação Inclusiva",
                area: "Tecnologia Educacional",
                orientador: "Prof. Dra. Maria Oliveira",
                status: "Recrutando"
              }
            ].map((projeto, index) => (
              <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{projeto.area}</Badge>
                    <Badge className={
                      projeto.status === "Recrutando" 
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }>
                      {projeto.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {projeto.title}
                  </CardTitle>
                  <CardDescription>
                    {projeto.orientador}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/projetos">
                    <Button variant="hero" size="sm" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link to="/projetos">
              <Button variant="outline">
                Ver Todos os Projetos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para começar sua jornada científica?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a centenas de estudantes que já estão desenvolvendo 
            pesquisas inovadoras e construindo o futuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projetos">
              <Button variant="hero" size="xl">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ICUSP</span>
            </div>
            <p className="text-background/70 mb-6">
              Conectando estudantes a oportunidades de pesquisa científica
            </p>
            <div className="flex justify-center space-x-6 text-sm text-background/70">
              <a href="#" className="hover:text-background transition-colors">Sobre</a>
              <a href="#" className="hover:text-background transition-colors">Contato</a>
              <a href="#" className="hover:text-background transition-colors">Ajuda</a>
              <a href="#" className="hover:text-background transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
