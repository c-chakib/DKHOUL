import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { 
  Search, MapPin, Star, Heart, Grid3x3, List, Map,
  SlidersHorizontal, Clock, X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SearchPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategory?: string;
  searchData?: any;
}

export function SearchPage({ onNavigate, initialCategory, searchData }: SearchPageProps) {
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    if (searchData?.query) {
      setSearchQuery(searchData.query);
    }
  }, [searchData]);
  const [showFilters, setShowFilters] = useState(true);

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

  const applyFilters = () => {
    toast.success('Filtres appliqués avec succès');
  };

  const resetFilters = () => {
    setPriceRange([50, 500]);
    setSearchQuery('');
    toast.info('Filtres réinitialisés');
  };

  const services = [
    {
      id: 1,
      title: 'Cours de cuisine tajine traditionnel',
      category: 'Skills',
      image: 'https://images.unsplash.com/photo-1752162958264-22f6f5aecd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMGNvb2tpbmclMjB0YWdpbmV8ZW58MXx8fHwxNzYxOTIxNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Fatima El Amrani',
      rating: 4.9,
      reviews: 87,
      price: 300,
      duration: '2h',
      location: 'Médina, Marrakech'
    },
    {
      id: 2,
      title: 'Espace coworking avec WiFi rapide',
      category: 'Space',
      image: 'https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NjE4OTYzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Youssef Bennani',
      rating: 4.8,
      reviews: 120,
      price: 60,
      duration: '1h',
      location: 'Guéliz, Marrakech'
    },
    {
      id: 3,
      title: 'Visite guidée des souks de la médina',
      category: 'Connect',
      image: 'https://images.unsplash.com/photo-1704738795093-5d8f864f4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbWVkaW5hJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTkyMTY3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Ahmed Zouani',
      rating: 5.0,
      reviews: 156,
      price: 150,
      duration: '3h',
      location: 'Médina, Marrakech'
    },
    {
      id: 4,
      title: 'Atelier poterie et zellige',
      category: 'Skills',
      image: 'https://images.unsplash.com/photo-1760727466768-9ba9780e3fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbG9jYWwlMjBwZW9wbGUlMjBjcmFmdHxlbnwxfHx8fDE3NjE5MjE2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Khadija Alami',
      rating: 4.9,
      reviews: 93,
      price: 250,
      duration: '2.5h',
      location: 'Safi'
    },
    {
      id: 5,
      title: 'Stockage sécurisé de bagages',
      category: 'Space',
      image: 'https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NjE4OTYzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Rachid Touil',
      rating: 4.7,
      reviews: 65,
      price: 50,
      duration: '4h',
      location: 'Gare, Marrakech'
    },
    {
      id: 6,
      title: 'Cours de darija marocain',
      category: 'Skills',
      image: 'https://images.unsplash.com/photo-1752162958264-22f6f5aecd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMGNvb2tpbmclMjB0YWdpbmV8ZW58MXx8fHwxNzYxOTIxNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      host: 'Leila Mansouri',
      rating: 4.8,
      reviews: 78,
      price: 180,
      duration: '1.5h',
      location: 'En ligne / Présent'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-white border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un service, un lieu, une activité..."
                  className="pl-10 pr-10"
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
              </Button>

              <div className="hidden md:flex items-center gap-2 border-l pl-4">
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-full md:w-80 flex-shrink-0">
              <Card className="p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">Filtres</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary"
                    onClick={resetFilters}
                  >
                    Réinitialiser
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <Label className="mb-3 block">Catégorie</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="space" defaultChecked={initialCategory === 'space'} />
                        <Label htmlFor="space" className="text-sm cursor-pointer">
                          Space - Espaces à louer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="skills" defaultChecked={initialCategory === 'skills'} />
                        <Label htmlFor="skills" className="text-sm cursor-pointer">
                          Skills - Apprendre & Créer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="connect" defaultChecked={initialCategory === 'connect'} />
                        <Label htmlFor="connect" className="text-sm cursor-pointer">
                          Connect - Accompagnement
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="mb-3 block">Prix par personne</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      min={0}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{priceRange[0]} DH</span>
                      <span>{priceRange[1]} DH</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <Label className="mb-3 block">Date</Label>
                    <Input type="date" />
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="mb-3 block">Note minimum</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="all" defaultChecked />
                        <Label htmlFor="all" className="text-sm cursor-pointer">
                          Toutes les notes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="4plus" />
                        <Label htmlFor="4plus" className="text-sm cursor-pointer flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          4.0+
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="45plus" />
                        <Label htmlFor="45plus" className="text-sm cursor-pointer flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          4.5+
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <Label className="mb-3 block">Langues parlées</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="french" />
                        <Label htmlFor="french" className="text-sm cursor-pointer">
                          🇫🇷 Français
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="arabic" />
                        <Label htmlFor="arabic" className="text-sm cursor-pointer">
                          🇲🇦 العربية
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="english" />
                        <Label htmlFor="english" className="text-sm cursor-pointer">
                          🇬🇧 English
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spanish" />
                        <Label htmlFor="spanish" className="text-sm cursor-pointer">
                          🇪🇸 Español
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Results */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl mb-1">{services.length} services à Marrakech</h2>
                <p className="text-muted-foreground">Résultats pour votre recherche</p>
              </div>

              <Select defaultValue="relevant">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Pertinence</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer group ${viewMode === 'list' ? 'flex' : ''}`}
                  onClick={() => onNavigate('service-detail', { id: service.id })}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64' : 'h-48'}`}>
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

                  <div className="p-4 flex-1">
                    <h4 className="mb-2 line-clamp-2">{service.title}</h4>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary text-white">
                          {service.host.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{service.host}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {service.location}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-border">
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

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" disabled>
                Précédent
              </Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <span className="px-2">...</span>
              <Button variant="outline">10</Button>
              <Button variant="outline">
                Suivant
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
