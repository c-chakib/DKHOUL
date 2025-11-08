import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Search, MapPin, Calendar, Home, Palette, Handshake, Star, ChevronRight, Heart } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const categories = [
    {
      id: 'space',
      icon: Home,
      title: 'Espaces à louer',
      subtitle: 'DKHOUL Space',
      description: 'Coworking, stockage bagages, douche...',
      price: 'À partir de 50 DH/h',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'skills',
      icon: Palette,
      title: 'Apprendre & Créer',
      subtitle: 'DKHOUL Skills',
      description: 'Cuisine, darija, artisanat, musique...',
      price: 'À partir de 150 DH/session',
      gradient: 'from-secondary to-emerald-600'
    },
    {
      id: 'connect',
      icon: Handshake,
      title: 'Services & Accompagnement',
      subtitle: 'DKHOUL Connect',
      description: 'Guide souk, conseils locaux, transport...',
      price: 'À partir de 100 DH/h',
      gradient: 'from-accent to-orange-600'
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigate('search', { query: searchQuery });
    } else {
      onNavigate('search');
    }
  };

  const toggleFavorite = (serviceId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    
    if (favorites.includes(serviceId)) {
      toast.success('Retiré des favoris');
    } else {
      toast.success('Ajouté aux favoris');
    }
  };

  const popularServices = [
    {
      id: 1,
      title: 'Cours de cuisine tajine traditionnel',
      category: 'Skills',
      image: 'https://images.unsplash.com/photo-1752162958264-22f6f5aecd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMGNvb2tpbmclMjB0YWdpbmV8ZW58MXx8fHwxNzYxOTIxNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Fatima El Amrani',
      rating: 4.9,
      reviews: 87,
      price: 300
    },
    {
      id: 2,
      title: 'Espace coworking avec WiFi rapide',
      category: 'Space',
      image: 'https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NjE4OTYzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Youssef Bennani',
      rating: 4.8,
      reviews: 120,
      price: 60
    },
    {
      id: 3,
      title: 'Visite guidée des souks de la médina',
      category: 'Connect',
      image: 'https://images.unsplash.com/photo-1704738795093-5d8f864f4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbWVkaW5hJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTkyMTY3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Ahmed Zouani',
      rating: 5.0,
      reviews: 156,
      price: 150
    },
    {
      id: 4,
      title: 'Atelier poterie et zellige',
      category: 'Skills',
      image: 'https://images.unsplash.com/photo-1760727466768-9ba9780e3fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbG9jYWwlMjBwZW9wbGUlMjBjcmFmdHxlbnwxfHx8fDE3NjE5MjE2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Khadija Alami',
      rating: 4.9,
      reviews: 93,
      price: 250
    }
  ];

  const testimonials = [
    {
      name: 'Sophie Martin',
      country: 'France',
      photo: 'SM',
      text: 'Une expérience incroyable! Fatima m\'a appris à faire un vrai tajine marocain. Authentique et chaleureux.'
    },
    {
      name: 'John Smith',
      country: 'USA',
      photo: 'JS',
      text: 'Best way to discover Marrakech! Local guides showed me places tourists never see. Highly recommend!'
    },
    {
      name: 'Maria Garcia',
      country: 'Spain',
      photo: 'MG',
      text: 'El coworking space fue perfecto para trabajar remotamente. Muy profesional y buen ambiente.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-4xl md:text-5xl mb-6">
              Vivez le vrai Maroc avec des locaux authentiques
            </h1>
            <p className="text-white/90 text-xl mb-10">
              Cours de cuisine, espaces coworking, accompagnements... Découvrez plus de 500 expériences uniques
            </p>

            {/* Search Bar */}
            <Card className="p-2 md:p-4 bg-white shadow-2xl">
              <div className="grid md:grid-cols-4 gap-2 md:gap-4">
                <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0 pr-0 md:pr-4">
                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Input 
                    placeholder="Où? (ex: Marrakech)"
                    className="border-0 focus-visible:ring-0 p-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0 pr-0 md:pr-4">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Input 
                    placeholder="Quand?"
                    type="date"
                    className="border-0 focus-visible:ring-0 p-0"
                  />
                </div>
                <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0 pr-0 md:pr-4">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <select className="w-full bg-transparent border-0 focus:outline-none focus:ring-0">
                    <option>Toutes catégories</option>
                    <option>Space</option>
                    <option>Skills</option>
                    <option>Connect</option>
                  </select>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Explorez par catégorie</h2>
            <p className="text-muted-foreground text-lg">
              Trouvez l'expérience parfaite pour votre séjour au Maroc
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onNavigate('search', { category: category.id })}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">{category.subtitle}</div>
                <h3 className="text-xl mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <div className="text-primary">{category.price}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl mb-2">Expériences les plus réservées</h2>
              <p className="text-muted-foreground">Découvrez ce que les voyageurs adorent</p>
            </div>
            <Button 
              variant="ghost"
              onClick={() => onNavigate('search')}
              className="hidden md:flex"
            >
              Voir tout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <Card 
                key={service.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onNavigate('service-detail', { id: service.id })}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-white text-foreground">
                    {service.category}
                  </Badge>
                  <button 
                    onClick={(e) => toggleFavorite(service.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(service.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="mb-2 line-clamp-2">{service.title}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {service.host.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{service.host}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm">{service.rating}</span>
                      <span className="text-sm text-muted-foreground">({service.reviews})</span>
                    </div>
                    <div>
                      <span className="text-lg text-primary">{service.price} DH</span>
                      <span className="text-sm text-muted-foreground">/pers</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Comment ça marche</h2>
            <p className="text-muted-foreground text-lg">
              Trois étapes simples pour vivre une expérience authentique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm">1</div>
              <h3 className="text-xl mb-2">Recherchez</h3>
              <p className="text-muted-foreground">
                Trouvez le service parfait parmi 500+ offres
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-secondary" />
              </div>
              <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm">2</div>
              <h3 className="text-xl mb-2">Réservez</h3>
              <p className="text-muted-foreground">
                Paiement sécurisé en ligne
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-accent" />
              </div>
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm">3</div>
              <h3 className="text-xl mb-2">Vivez l'expérience</h3>
              <p className="text-muted-foreground">
                Rencontrez votre Host et profitez!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Ce que disent nos voyageurs</h2>
            <p className="text-muted-foreground text-lg">
              Des milliers d'expériences positives partagées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-white">
                      {testimonial.photo}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-600 to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-3xl md:text-4xl mb-4">
            Gagnez jusqu'à 5000 DH/mois en partageant ce que vous avez
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez 500+ Hosts qui monétisent leurs espaces et compétences
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-white text-lg px-8"
            onClick={() => onNavigate('host-dashboard')}
          >
            Devenir Host
          </Button>
        </div>
      </section>
    </div>
  );
}
