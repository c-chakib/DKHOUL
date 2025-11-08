import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Calendar } from '../ui/calendar';
import { Separator } from '../ui/separator';
import {
  Star, MapPin, Clock, Users, Check, MessageSquare,
  Share2, Heart, ChevronLeft, Shield, Calendar as CalendarIcon
} from 'lucide-react';

interface ServiceDetailPageProps {
  onNavigate: (page: string, data?: any) => void;
  serviceId?: number;
}

export function ServiceDetailPage({ onNavigate, serviceId = 1 }: ServiceDetailPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [numberOfPeople, setNumberOfPeople] = useState(2);

  const service = {
    id: 1,
    title: 'Cours de cuisine tajine traditionnel',
    category: 'Skills',
    images: [
      'https://images.unsplash.com/photo-1752162958264-22f6f5aecd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NhbiUyMGNvb2tpbmclMjB0YWdpbmV8ZW58MXx8fHwxNzYxOTIxNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1704738795093-5d8f864f4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbWVkaW5hJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTkyMTY3NXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1760727466768-9ba9780e3fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwbG9jYWwlMjBwZW9wbGUlMjBjcmFmdHxlbnwxfHx8fDE3NjE5MjE2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NjE4OTYzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    host: {
      name: 'Fatima El Amrani',
      avatar: 'FE',
      rating: 4.9,
      reviews: 87,
      languages: ['🇫🇷', '🇲🇦', '🇬🇧'],
      memberSince: '2024',
      isSuperHost: true
    },
    rating: 4.9,
    reviewsCount: 87,
    price: 300,
    duration: '2 heures',
    maxPeople: 4,
    location: 'Médina, Marrakech',
    description: `Plongez dans l'art culinaire marocain avec ce cours de cuisine authentique! Je suis Fatima, passionnée de cuisine traditionnelle depuis mon enfance. Dans cette expérience unique, je vous apprendrai à préparer un tajine marocain traditionnel selon la recette familiale transmise de génération en génération.

Nous commencerons par une visite rapide au marché local pour choisir ensemble les ingrédients frais. De retour à ma maison dans la médina, vous découvrirez tous les secrets de la préparation: le mélange d'épices traditionnel, la cuisson lente et les techniques ancestrales.

Cette expérience est parfaite pour les amateurs de cuisine et ceux qui souhaitent ramener un peu du Maroc chez eux!`,
    highlights: [
      'Ingrédients frais du marché local',
      'Recette familiale transmise de génération en génération',
      'Groupe intime de maximum 4 personnes',
      'Emportez votre création et la recette écrite',
      'Dégustation du repas préparé ensemble'
    ],
    included: [
      'Tous les ingrédients nécessaires',
      'Tablier et équipement de cuisine',
      'Dégustation complète du repas',
      'Recette écrite en français et anglais',
      'Thé à la menthe et pâtisseries marocaines'
    ]
  };

  const timeSlots = ['10:00', '14:00', '17:00'];

  const reviews = [
    {
      author: 'Sophie Martin',
      avatar: 'SM',
      country: 'France',
      date: 'Il y a 2 semaines',
      rating: 5,
      comment: 'Expérience absolument incroyable! Fatima est une hôte merveilleuse et le tajine était délicieux. J\'ai adoré la visite du marché et tous les petits secrets qu\'elle a partagés. Je recommande à 100%!'
    },
    {
      author: 'John Smith',
      avatar: 'JS',
      country: 'USA',
      date: 'Il y a 1 mois',
      rating: 5,
      comment: 'Best cooking class I\'ve ever taken! Very authentic and hands-on. Fatima made us feel like family. The tajine recipe is now a favorite at home!'
    },
    {
      author: 'Maria Garcia',
      avatar: 'MG',
      country: 'Spain',
      date: 'Il y a 1 mois',
      rating: 4.5,
      comment: 'Muy buena experiencia. La comida estaba deliciosa y aprendimos mucho. El ambiente familiar fue lo mejor.'
    }
  ];

  const totalPrice = service.price * numberOfPeople;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Actions */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('search')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour aux résultats</span>
            </button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
          <div className="col-span-4 md:col-span-2 md:row-span-2">
            <ImageWithFallback
              src={service.images[0]}
              alt={service.title}
              className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
            />
          </div>
          {service.images.slice(1, 5).map((image, index) => (
            <div key={index} className="hidden md:block">
              <ImageWithFallback
                src={image}
                alt={`${service.title} ${index + 2}`}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          ))}
          <Button 
            variant="outline" 
            className="absolute bottom-4 right-4 bg-white"
          >
            Voir toutes les photos
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <Badge className="mb-2">{service.category}</Badge>
              <h1 className="text-3xl mb-2">{service.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{service.rating}</span>
                  <span>({service.reviewsCount} avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
              </div>
            </div>

            {/* Host Card */}
            <Card className="p-6 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-white text-lg">
                      {service.host.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3>{service.host.name}</h3>
                      {service.host.isSuperHost && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Super Host
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Membre depuis {service.host.memberSince}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {service.host.languages.map((lang, i) => (
                          <span key={i}>{lang}</span>
                        ))}
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm">{service.host.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => onNavigate('messages')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              </div>
            </Card>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl mb-4">À propos de cette expérience</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Points forts</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {service.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Ce qui est inclus</h2>
              <div className="space-y-2">
                {service.included.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Avis des voyageurs</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="text-xl">{service.rating}/5</span>
                  <span className="text-muted-foreground">({service.reviewsCount} avis)</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-1">{service.rating}</div>
                  <div className="text-sm text-muted-foreground mb-2">Qualité</div>
                  <div className="flex gap-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-1">5.0</div>
                  <div className="text-sm text-muted-foreground mb-2">Communication</div>
                  <div className="flex gap-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-1">4.8</div>
                  <div className="text-sm text-muted-foreground mb-2">Rapport qualité/prix</div>
                  <div className="flex gap-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="mb-0.5">{review.author}</h4>
                            <p className="text-sm text-muted-foreground">{review.country}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                Voir tous les {service.reviewsCount} avis
              </Button>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-3xl text-primary">{service.price} DH</span>
                  <span className="text-muted-foreground"> / personne</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm mb-2 block">Date</label>
                  <div className="border border-border rounded-lg p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block">Heure</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block">Nombre de personnes</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    >
                      -
                    </Button>
                    <span className="flex-1 text-center">{numberOfPeople}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNumberOfPeople(Math.min(service.maxPeople, numberOfPeople + 1))}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum {service.maxPeople} personnes
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">{service.price} DH × {numberOfPeople} personnes</span>
                  <span>{totalPrice} DH</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Commission service</span>
                  <span className="text-muted-foreground">Incluse</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-xl text-primary">{totalPrice} DH</span>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 mb-4"
                size="lg"
                onClick={() => onNavigate('booking', { 
                  service: {
                    title: service.title,
                    host: service.host,
                    price: service.price,
                    image: service.images[0]
                  },
                  date: selectedDate,
                  time: selectedTime,
                  people: numberOfPeople
                })}
              >
                Réserver
              </Button>

              <p className="text-xs text-center text-muted-foreground mb-4">
                Vous ne serez débité qu'après acceptation du Host
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Annulation gratuite 24h avant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Service client 24/7</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
