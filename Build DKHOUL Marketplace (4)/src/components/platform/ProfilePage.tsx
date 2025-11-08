import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import {
  User, MapPin, Calendar, Star, Shield, Languages,
  Mail, Phone, Globe, Edit, Save, CheckCircle2,
  Heart, Clock, MessageSquare, Settings, Plus
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Fatima Zahra',
    email: 'fatima.zahra@gmail.com',
    phone: '+212 6 12 34 56 78',
    location: 'Fès, Maroc',
    bio: 'Passionnée par la cuisine marocaine traditionnelle et le partage de notre culture avec les voyageurs du monde entier. Host sur DKHOUL depuis 2024.',
    languages: ['Français', 'Arabe', 'Anglais'],
    website: '',
    interests: ['Cuisine', 'Artisanat', 'Histoire', 'Culture']
  });

  const stats = {
    memberSince: '2024-03-15',
    totalBookings: 47,
    asHost: 47,
    asGuest: 8,
    averageRating: 4.8,
    totalReviews: 38,
    responseRate: 95,
    responseTime: '2 heures'
  };

  const verifications = [
    { label: 'Email vérifié', verified: true },
    { label: 'Téléphone vérifié', verified: true },
    { label: 'Identité vérifiée', verified: true },
    { label: 'Adresse vérifiée', verified: false }
  ];

  const favoriteServices = [
    {
      id: 1,
      title: 'Cours de Poterie Berbère',
      host: 'Ahmed M.',
      location: 'Rabat',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
      price: 180,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Visite Guidée Jardin Majorelle',
      host: 'Yasmine K.',
      location: 'Marrakech',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      price: 150,
      rating: 5.0
    },
    {
      id: 3,
      title: 'Atelier Calligraphie Arabe',
      host: 'Hassan B.',
      location: 'Casablanca',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
      price: 200,
      rating: 4.8
    }
  ];

  const pastBookings = [
    {
      id: 1,
      service: 'Cours de Poterie Berbère',
      host: 'Ahmed M.',
      date: '2025-10-15',
      rating: 5,
      reviewed: true
    },
    {
      id: 2,
      service: 'Visite Guidée Jardin Majorelle',
      host: 'Yasmine K.',
      date: '2025-09-22',
      rating: 5,
      reviewed: true
    },
    {
      id: 3,
      service: 'Cours de Cuisine Berbère',
      host: 'Mohammed T.',
      date: '2025-08-10',
      rating: 4,
      reviewed: false
    }
  ];

  const reviews = [
    {
      id: 1,
      from: 'Sophie Martin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      service: 'Atelier de Cuisine Marocaine',
      rating: 5,
      comment: 'Expérience incroyable ! Fatima est une hôte exceptionnelle et les tajines étaient délicieux.',
      date: '2025-10-28'
    },
    {
      id: 2,
      from: 'David Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      service: 'Cours de Darija',
      rating: 5,
      comment: "Très pédagogue et patiente. J'ai appris beaucoup de phrases utiles en quelques heures.",
      date: '2025-10-20'
    },
    {
      id: 3,
      from: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      service: 'Atelier de Cuisine Marocaine',
      rating: 5,
      comment: 'Magnifique expérience ! Fatima nous a appris à faire des pastillas authentiques.',
      date: '2025-10-12'
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima" />
                <AvatarFallback>FZ</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Changer la photo
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl mb-2">{profileData.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Membre depuis {new Date(stats.memberSince).toLocaleDateString('fr-FR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  variant={isEditing ? 'default' : 'outline'}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-2xl">{stats.averageRating}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    Note moyenne
                  </div>
                </div>
                <div>
                  <div className="text-2xl">{stats.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Avis reçus</div>
                </div>
                <div>
                  <div className="text-2xl">{stats.asHost}</div>
                  <div className="text-sm text-muted-foreground">En tant que Host</div>
                </div>
                <div>
                  <div className="text-2xl">{stats.asGuest}</div>
                  <div className="text-sm text-muted-foreground">En tant que Voyageur</div>
                </div>
              </div>

              {/* Verifications */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-secondary text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Super Host
                </Badge>
                {verifications.filter(v => v.verified).map((v, i) => (
                  <Badge key={i} variant="outline" className="border-primary text-primary">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {v.label}
                  </Badge>
                ))}
              </div>

              {/* Bio */}
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={3}
                  className="mb-4"
                />
              ) : (
                <p className="text-muted-foreground mb-4">{profileData.bio}</p>
              )}

              {/* Languages */}
              <div className="flex items-center gap-2 flex-wrap">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Langues parlées:</span>
                {profileData.languages.map((lang, i) => (
                  <Badge key={i} variant="outline">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">
              <User className="w-4 h-4 mr-2" />
              À propos
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Avis ({stats.totalReviews})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl mb-6">Informations personnelles</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Téléphone</Label>
                  {isEditing ? (
                    <Input 
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Localisation</Label>
                  {isEditing ? (
                    <Input 
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Site web (optionnel)</Label>
                  {isEditing ? (
                    <Input 
                      type="url"
                      placeholder="https://..."
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                  ) : profileData.website ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profileData.website}
                      </a>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">Non renseigné</div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-6">Centres d'intérêt</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, i) => (
                  <Badge key={i} variant="secondary" className="px-4 py-2">
                    {interest}
                  </Badge>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Performance en tant que Host</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Taux de réponse</span>
                    <span>{stats.responseRate}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary"
                      style={{ width: `${stats.responseRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Temps de réponse moyen</span>
                  </div>
                  <div>{stats.responseTime}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Historique des réservations</h2>
              <div className="space-y-3">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="mb-1">{booking.service}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString('fr-FR')} • {booking.host}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < booking.rating
                                ? 'text-accent fill-accent'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      {!booking.reviewed && (
                        <Button size="sm" variant="outline">
                          Laisser un avis
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>{review.from[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4>{review.from}</h4>
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
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    >
                      <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-1">{service.title}</h3>
                    <div className="text-sm text-muted-foreground mb-3">
                      <div>{service.host}</div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {service.location}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span>{service.rating}</span>
                      </div>
                      <div className="text-primary">{service.price} DH</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl mb-6">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">Notifications par email</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir les notifications importantes par email
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">Notifications de réservation</div>
                    <div className="text-sm text-muted-foreground">
                      Être notifié des nouvelles demandes de réservation
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">Notifications de messages</div>
                    <div className="text-sm text-muted-foreground">
                      Être notifié des nouveaux messages
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">Newsletter DKHOUL</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir les actualités et conseils
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-6">Confidentialité</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">Profil public</div>
                    <div className="text-sm text-muted-foreground">
                      Rendre mon profil visible par les autres utilisateurs
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-1">Afficher les avis reçus</div>
                    <div className="text-sm text-muted-foreground">
                      Permettre aux visiteurs de voir mes avis
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-6">Sécurité</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Vérifier mon identité
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-destructive/50">
              <h2 className="text-xl mb-4 text-destructive">Zone de danger</h2>
              <p className="text-sm text-muted-foreground mb-4">
                La suppression de votre compte est irréversible. Toutes vos données seront perdues.
              </p>
              <Button variant="destructive">
                Supprimer mon compte
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
