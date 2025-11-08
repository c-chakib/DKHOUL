import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import {
  TrendingUp, DollarSign, Calendar, Star, Users,
  Eye, MessageSquare, Clock, CheckCircle2, XCircle,
  Plus, Edit, BarChart3, Package
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface HostDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HostDashboard({ onNavigate }: HostDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock data
  const stats = {
    totalRevenue: 14280,
    thisMonthRevenue: 3420,
    totalBookings: 47,
    thisMonthBookings: 12,
    averageRating: 4.8,
    totalReviews: 38,
    responseRate: 95,
    activeServices: 3
  };

  const revenueData = [
    { name: 'Jan', revenue: 1200 },
    { name: 'Fév', revenue: 1800 },
    { name: 'Mar', revenue: 2100 },
    { name: 'Avr', revenue: 2400 },
    { name: 'Mai', revenue: 2890 },
    { name: 'Jun', revenue: 3420 }
  ];

  const categoryData = [
    { name: 'Space', value: 35, color: '#2563EB' },
    { name: 'Skills', value: 45, color: '#059669' },
    { name: 'Connect', value: 20, color: '#F59E0B' }
  ];

  const services = [
    {
      id: 1,
      title: 'Atelier de Cuisine Marocaine',
      category: 'Skills',
      price: 280,
      image: 'https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=400',
      status: 'active',
      bookings: 18,
      revenue: 5040,
      rating: 4.9,
      views: 234
    },
    {
      id: 2,
      title: 'Espace Coworking avec Vue',
      category: 'Space',
      price: 60,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      status: 'active',
      bookings: 23,
      revenue: 1380,
      rating: 4.7,
      views: 456
    },
    {
      id: 3,
      title: 'Guide Privé Médina de Fès',
      category: 'Connect',
      price: 200,
      image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400',
      status: 'active',
      bookings: 6,
      revenue: 1200,
      rating: 5.0,
      views: 123
    }
  ];

  const upcomingBookings = [
    {
      id: 1,
      service: 'Atelier de Cuisine Marocaine',
      guest: {
        name: 'Sophie Martin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
      },
      date: '2025-11-05',
      time: '14:00',
      guests: 2,
      amount: 560,
      status: 'confirmed'
    },
    {
      id: 2,
      service: 'Espace Coworking avec Vue',
      guest: {
        name: 'John Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      date: '2025-11-06',
      time: '09:00',
      guests: 1,
      amount: 60,
      status: 'pending'
    },
    {
      id: 3,
      service: 'Guide Privé Médina de Fès',
      guest: {
        name: 'Maria Garcia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
      },
      date: '2025-11-08',
      time: '10:00',
      guests: 3,
      amount: 600,
      status: 'confirmed'
    }
  ];

  const recentReviews = [
    {
      id: 1,
      guest: {
        name: 'Emma Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
      },
      service: 'Atelier de Cuisine Marocaine',
      rating: 5,
      comment: 'Expérience incroyable ! Fatima est une hôte exceptionnelle et les tajines étaient délicieux.',
      date: '2025-10-28'
    },
    {
      id: 2,
      guest: {
        name: 'David Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
      },
      service: 'Espace Coworking avec Vue',
      rating: 5,
      comment: 'Parfait pour travailler au calme. WiFi rapide et vue magnifique sur la médina.',
      date: '2025-10-26'
    },
    {
      id: 3,
      guest: {
        name: 'Lisa Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
      },
      service: 'Guide Privé Médina de Fès',
      rating: 5,
      comment: 'Guide passionnant qui connaît tous les secrets de la médina. Fortement recommandé !',
      date: '2025-10-24'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl mb-2">Dashboard Host</h1>
            <p className="text-muted-foreground">
              Gérez vos services et suivez vos performances
            </p>
          </div>
          <Button onClick={() => onNavigate('platform-home')} className="bg-secondary hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Service
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +24%
              </Badge>
            </div>
            <div className="text-2xl mb-1">{stats.thisMonthRevenue.toLocaleString()} DH</div>
            <div className="text-sm text-muted-foreground">Revenus ce mois</div>
            <div className="text-xs text-muted-foreground mt-2">
              Total: {stats.totalRevenue.toLocaleString()} DH
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18%
              </Badge>
            </div>
            <div className="text-2xl mb-1">{stats.thisMonthBookings}</div>
            <div className="text-sm text-muted-foreground">Réservations ce mois</div>
            <div className="text-xs text-muted-foreground mt-2">
              Total: {stats.totalBookings} réservations
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <Badge variant="outline" className="text-xs border-accent text-accent">
                Excellent
              </Badge>
            </div>
            <div className="text-2xl mb-1">{stats.averageRating.toFixed(1)} ★</div>
            <div className="text-sm text-muted-foreground">Note moyenne</div>
            <div className="text-xs text-muted-foreground mt-2">
              {stats.totalReviews} avis
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-xs border-secondary text-secondary">
                Rapide
              </Badge>
            </div>
            <div className="text-2xl mb-1">{stats.responseRate}%</div>
            <div className="text-sm text-muted-foreground">Taux de réponse</div>
            <div className="text-xs text-muted-foreground mt-2">
              Temps moyen: 2h
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Évolution des revenus</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('week')}
                >
                  Semaine
                </Button>
                <Button
                  size="sm"
                  variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('month')}
                >
                  Mois
                </Button>
                <Button
                  size="sm"
                  variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('year')}
                >
                  Année
                </Button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    name="Revenus (DH)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl mb-6">Répartition par catégorie</h2>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-muted-foreground">{cat.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">
              <Package className="w-4 h-4 mr-2" />
              Mes Services
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Avis
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl">{service.title}</h3>
                          <Badge variant="outline">{service.category}</Badge>
                          <Badge className="bg-secondary text-white">Actif</Badge>
                        </div>
                        <div className="text-muted-foreground">{service.price} DH / session</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Réservations</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{service.bookings}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Revenus</div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-secondary" />
                          <span>{service.revenue.toLocaleString()} DH</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Note</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Vues</div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>{service.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={booking.guest.avatar} />
                    <AvatarFallback>{booking.guest.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3>{booking.guest.name}</h3>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                        {booking.status === 'confirmed' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Confirmé
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            En attente
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{booking.service}</div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(booking.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.guests} personne{booking.guests > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div className="text-xl text-primary">{booking.amount} DH</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onNavigate('messages')}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Accepter
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {recentReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.guest.avatar} />
                    <AvatarFallback>{review.guest.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4>{review.guest.name}</h4>
                        <div className="text-sm text-muted-foreground">{review.service}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-accent fill-accent'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground">{review.comment}</p>

                    <Button variant="link" className="mt-2 p-0 h-auto text-primary">
                      Répondre à cet avis
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
