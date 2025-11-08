import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, Users, DollarSign, Target, Calendar,
  CheckCircle2, ArrowUpRight, Download, Mail,
  Globe, Heart, Briefcase, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface InvestorPitchProps {
  onNavigate: (page: string) => void;
}

export function InvestorPitch({ onNavigate }: InvestorPitchProps) {
  const revenueData = [
    { year: 'Année 1', revenue: 720, hosts: 50 },
    { year: 'Année 2', revenue: 4320, hosts: 200 },
    { year: 'Année 3', revenue: 18000, hosts: 500 },
    { year: 'Année 4', revenue: 54000, hosts: 1200 },
    { year: 'Année 5 (2030)', revenue: 100000, hosts: 2000 }
  ];

  const categoryData = [
    { name: 'Space', value: 35, color: '#2563EB' },
    { name: 'Skills', value: 45, color: '#059669' },
    { name: 'Connect', value: 20, color: '#F59E0B' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onNavigate('gateway')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">د</span>
              </div>
              <div className="hidden md:block">
                <div className="text-primary text-xl">DKHOUL</div>
                <div className="text-xs text-muted-foreground -mt-1">Investor Pitch</div>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#problem" className="text-muted-foreground hover:text-primary transition-colors">Problème</a>
              <a href="#solution" className="text-muted-foreground hover:text-primary transition-colors">Solution</a>
              <a href="#market" className="text-muted-foreground hover:text-primary transition-colors">Marché</a>
              <a href="#business" className="text-muted-foreground hover:text-primary transition-colors">Business Model</a>
              <a href="#financials" className="text-muted-foreground hover:text-primary transition-colors">Financials</a>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onNavigate('platform-home')}>
                Voir la Démo
              </Button>
              <Button className="bg-accent hover:bg-accent/90">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-blue-600 to-secondary py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 border-white/30 text-white backdrop-blur-sm">
              Opportunité d'Investissement
            </Badge>
            <h1 className="text-4xl md:text-5xl mb-6">
              DKHOUL : Démocratiser le Tourisme Marocain
            </h1>
            <p className="text-xl text-white/90 mb-8">
              La première marketplace permettant aux Marocains de monétiser leurs espaces, compétences et temps auprès de 15 millions de touristes annuels
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-white/10 backdrop-blur border-white/20">
                <div className="text-3xl mb-2">500K DH</div>
                <div className="text-sm text-white/80">Financement Recherché</div>
              </Card>
              <Card className="p-6 bg-white/10 backdrop-blur border-white/20">
                <div className="text-3xl mb-2">15%</div>
                <div className="text-sm text-white/80">Equity Proposée</div>
              </Card>
              <Card className="p-6 bg-white/10 backdrop-blur border-white/20">
                <div className="text-3xl mb-2">100M+ DH</div>
                <div className="text-sm text-white/80">Revenus 2030</div>
              </Card>
            </div>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le Pitch Deck
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Le Problème</Badge>
              <h2 className="text-3xl mb-4">L'Exclusion du Tourisme Marocain</h2>
              <p className="text-xl text-muted-foreground">
                Malgré 15 millions de touristes annuels, les revenus sont captés par de grands groupes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8">
                <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl mb-3">Concentration des Revenus</h3>
                <p className="text-muted-foreground mb-4">
                  Les grands hôtels, tours opérateurs et agences captent la majorité des revenus touristiques
                </p>
                <div className="text-3xl text-destructive">85%</div>
                <div className="text-sm text-muted-foreground">des revenus vont aux grands groupes</div>
              </Card>

              <Card className="p-8">
                <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl mb-3">Marocains Exclus</h3>
                <p className="text-muted-foreground mb-4">
                  Les Marocains ordinaires ne peuvent pas monétiser facilement leurs espaces ou compétences
                </p>
                <div className="text-3xl text-destructive">Millions</div>
                <div className="text-sm text-muted-foreground">de Marocains exclus du tourisme</div>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
              <h3 className="text-xl mb-4">Impact sur l'Économie Locale</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-destructive">✗</span>
                  </div>
                  <span>Manque d'opportunités de revenus complémentaires pour les familles marocaines</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-destructive">✗</span>
                  </div>
                  <span>Touristes cherchent des expériences authentiques mais ne trouvent pas facilement</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-destructive">✗</span>
                  </div>
                  <span>Absence de plateforme centralisée pour les micro-services touristiques</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary text-white">Notre Solution</Badge>
              <h2 className="text-3xl mb-4">DKHOUL : Trois Catégories de Services</h2>
              <p className="text-xl text-muted-foreground">
                Une marketplace qui connecte touristes et Marocains pour des micro-services authentiques
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-center mb-3">DKHOUL Space</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Espaces à louer à l'heure
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Coworking avec WiFi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Stockage de bagages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Douche / Toilettes</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <span className="text-primary">50-100 DH/heure</span>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-emerald-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-center mb-3">DKHOUL Skills</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Apprendre et créer
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Cours de cuisine</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Leçons de darija</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Ateliers artisanat</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <span className="text-secondary">150-400 DH/session</span>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-center mb-3">DKHOUL Connect</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Services et accompagnement
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Guide des souks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Conseils locaux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Transport privé</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <span className="text-accent">100-300 DH/heure</span>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-xl mb-6 text-center">Comment ça marche</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">1</div>
                  <h4 className="mb-2">Inscription Host</h4>
                  <p className="text-sm text-muted-foreground">Le Marocain crée son profil et liste ses services</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">2</div>
                  <h4 className="mb-2">Réservation Touriste</h4>
                  <p className="text-sm text-muted-foreground">Le touriste trouve, réserve et paie en ligne</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">3</div>
                  <h4 className="mb-2">Commission 20%</h4>
                  <p className="text-sm text-muted-foreground">DKHOUL prend 20%, le Host reçoit 80%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Market Section */}
      <section id="market" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Opportunité de Marché</Badge>
              <h2 className="text-3xl mb-4">Un Marché Massif en Croissance</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center">
                <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl mb-2">15M</div>
                <div className="text-sm text-muted-foreground">Touristes/an</div>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl mb-2">+12%</div>
                <div className="text-sm text-muted-foreground">Croissance annuelle</div>
              </Card>
              <Card className="p-6 text-center">
                <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-3xl mb-2">2030</div>
                <div className="text-sm text-muted-foreground">Coupe du Monde</div>
              </Card>
              <Card className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl mb-2">100B DH</div>
                <div className="text-sm text-muted-foreground">Marché touristique</div>
              </Card>
            </div>

            <Card className="p-8 mb-8">
              <h3 className="text-xl mb-6">Événements Majeurs</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <h4>Coupe du Monde 2030</h4>
                    <p className="text-sm text-muted-foreground">Pic de demande avec des millions de visiteurs supplémentaires</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4>CAN 2025</h4>
                    <p className="text-sm text-muted-foreground">Afflux important de touristes africains</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <h4>Croissance du Tourisme Expérientiel</h4>
                    <p className="text-sm text-muted-foreground">Les touristes recherchent de plus en plus d'expériences authentiques</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section id="business" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary text-white">Business Model</Badge>
              <h2 className="text-3xl mb-4">Modèle de Commission Simple</h2>
            </div>

            <Card className="p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl mb-4">Revenus</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>20% de commission</strong> sur chaque transaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Frais d'inscription Host Premium (optionnel)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Publicité pour Hosts (mise en avant)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl mb-4">Coûts Principaux</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5">•</div>
                      <span>Plateforme tech et maintenance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5">•</div>
                      <span>Marketing d'acquisition</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5">•</div>
                      <span>Support client et modération</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="mb-8">
              <h3 className="text-xl mb-6">Répartition par Catégorie (Prévisions)</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <Card className="p-4 border-l-4 border-l-primary">
                    <div className="flex justify-between items-center">
                      <span>DKHOUL Space</span>
                      <span className="text-primary">35%</span>
                    </div>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-secondary">
                    <div className="flex justify-between items-center">
                      <span>DKHOUL Skills</span>
                      <span className="text-secondary">45%</span>
                    </div>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-accent">
                    <div className="flex justify-between items-center">
                      <span>DKHOUL Connect</span>
                      <span className="text-accent">20%</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section id="financials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent text-white">Projections Financières</Badge>
              <h2 className="text-3xl mb-4">Croissance sur 5 Ans</h2>
              <p className="text-xl text-muted-foreground">
                De 720K DH en Année 1 à 100M+ DH en 2030
              </p>
            </div>

            <Card className="p-8 mb-8">
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenus (K DH)"
                      stroke="#2563EB" 
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-5 gap-4">
                {revenueData.map((data, index) => (
                  <Card key={index} className="p-4 bg-primary/5">
                    <div className="text-xs text-muted-foreground mb-1">{data.year}</div>
                    <div className="text-xl mb-1">{data.revenue >= 1000 ? `${data.revenue / 1000}M` : `${data.revenue}K`} DH</div>
                    <div className="text-xs text-muted-foreground">{data.hosts} Hosts</div>
                  </Card>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl mb-4">Hypothèses Clés</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Croissance de 200% des Hosts par an (Années 1-3)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Panier moyen : 180 DH par transaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Chaque Host génère 12 transactions/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Pic en 2030 avec la Coupe du Monde</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl mb-4">Utilisation des Fonds (500K DH)</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Développement Tech</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Marketing & Acquisition</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Opérations & Support</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Légal & Admin</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Social */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary text-white">Impact Social</Badge>
              <h2 className="text-3xl mb-4">Créer des Opportunités pour Tous</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">5000 DH</div>
                <div className="text-sm text-muted-foreground">Revenu mensuel moyen par Host</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">2000+</div>
                <div className="text-sm text-muted-foreground">Hosts actifs en 2030</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">60%</div>
                <div className="text-sm text-muted-foreground">Revenus restent dans communautés locales</div>
              </Card>
            </div>

            <Card className="p-8">
              <h3 className="text-xl mb-6">Bénéfices Sociaux</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Revenus complémentaires pour familles marocaines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Valorisation des compétences traditionnelles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Échanges culturels authentiques</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Création d'emplois indirects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Développement du tourisme durable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Réduction des inégalités économiques</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-600 to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Rejoignez-nous dans cette Aventure
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Investissez dans DKHOUL et participez à la démocratisation du tourisme marocain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Mail className="w-4 h-4 mr-2" />
                Demander un RDV
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate('platform-home')}>
                Explorer la Plateforme
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
