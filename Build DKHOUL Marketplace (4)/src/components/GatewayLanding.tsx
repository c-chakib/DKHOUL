import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Users, TrendingUp, Rocket, Eye } from 'lucide-react';

interface GatewayLandingProps {
  onNavigate: (page: string) => void;
}

export function GatewayLanding({ onNavigate }: GatewayLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-secondary">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <span className="text-primary text-2xl">د</span>
          </div>
          <div>
            <div className="text-white text-2xl">DKHOUL</div>
            <div className="text-white/80 text-xs">Welcome to Morocco</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-2">
              <Rocket className="w-4 h-4 mr-2" />
              Projet Innovant • Innovation Award 2025
            </Badge>
            <h1 className="text-white text-4xl md:text-6xl mb-6 leading-tight">
              Connecter 15M de touristes
              <br />
              avec les Marocains
            </h1>
            <p className="text-white/90 text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
              La première marketplace qui permet aux Marocains de monétiser leurs espaces, compétences et temps
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>500+ Hosts actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>100M DH projeté en 2030</span>
              </div>
            </div>
          </div>

          {/* Two Main Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Platform Demo Card */}
            <Card className="p-8 hover:shadow-2xl transition-all group cursor-pointer border-2 border-transparent hover:border-primary">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1704738795093-5d8f864f4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbWVkaW5hJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTkyMTY3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Platform Demo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-secondary text-white">
                  <Eye className="w-3 h-3 mr-1" />
                  Démo Interactive
                </Badge>
              </div>
              
              <h2 className="text-2xl mb-3">Explorer la Plateforme</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez comment DKHOUL fonctionne : parcourez les services, consultez les profils des Hosts, et explorez l'expérience utilisateur complète.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Navigation interactive de la marketplace</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Recherche et filtres de services</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Pages détaillées et processus de réservation</span>
                </li>
              </ul>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 group-hover:translate-x-1 transition-transform"
                size="lg"
                onClick={() => onNavigate('platform-home')}
              >
                Voir la Démo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Investor Pitch Card */}
            <Card className="p-8 hover:shadow-2xl transition-all group cursor-pointer border-2 border-transparent hover:border-accent">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1599592187465-6dc742367282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwcGl0Y2glMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzYxOTIyMTA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Investor Pitch"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-accent text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Opportunité d'Investissement
                </Badge>
              </div>
              
              <h2 className="text-2xl mb-3">Dossier Investisseur</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez l'opportunité d'investissement : marché, modèle économique, projections financières et impact social de DKHOUL.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Problématique et opportunité de marché</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Modèle économique et projections financières</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                  <span>Demande de financement : 500,000 DH</span>
                </li>
              </ul>

              <Button 
                className="w-full bg-accent hover:bg-accent/90 group-hover:translate-x-1 transition-transform"
                size="lg"
                onClick={() => onNavigate('investor-pitch')}
              >
                Voir le Pitch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>

          {/* Stats Bar */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              <div>
                <div className="text-3xl mb-1">15M</div>
                <div className="text-sm text-white/80">Touristes/an</div>
              </div>
              <div>
                <div className="text-3xl mb-1">500K DH</div>
                <div className="text-sm text-white/80">Recherchés</div>
              </div>
              <div>
                <div className="text-3xl mb-1">100M+</div>
                <div className="text-sm text-white/80">Revenus 2030</div>
              </div>
              <div>
                <div className="text-3xl mb-1">20%</div>
                <div className="text-sm text-white/80">Commission</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/95 backdrop-blur">
            <h3 className="text-2xl mb-6 text-center">Pourquoi DKHOUL ?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="mb-2">Impact Social Massif</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Permet aux Marocains ordinaires de bénéficier directement du tourisme et de générer des revenus complémentaires
                </p>
                <Badge variant="outline" className="text-xs">
                  5000 DH/mois par Host
                </Badge>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="mb-2">Marché en Croissance</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  15M touristes annuels au Maroc avec des événements majeurs à venir (Coupe du Monde 2030, CAN 2025)
                </p>
                <Badge variant="outline" className="text-xs">
                  +12% croissance/an
                </Badge>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-accent" />
                </div>
                <h4 className="mb-2">Première au Maroc</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Unique plateforme de micro-services touristiques permettant de monétiser espaces, compétences et temps
                </p>
                <Badge variant="outline" className="text-xs">
                  Position de leader
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
