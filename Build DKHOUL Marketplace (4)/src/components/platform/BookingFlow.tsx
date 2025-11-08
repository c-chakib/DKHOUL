import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Calendar } from '../ui/calendar';
import { 
  CheckCircle2, Clock, CreditCard, Shield, 
  Calendar as CalendarIcon, Users, MessageSquare,
  ArrowLeft, ArrowRight
} from 'lucide-react';

interface BookingFlowProps {
  onNavigate: (page: string, data?: any) => void;
  serviceData?: any;
}

type BookingStep = 'details' | 'payment' | 'confirmation';

export function BookingFlow({ onNavigate, serviceData }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    time: '14:00',
    guests: 1,
    message: '',
    // Payment info
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    // Confirmation
    bookingId: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  });

  const service = serviceData || {
    title: 'Atelier de Cuisine Marocaine Traditionelle',
    host: {
      name: 'Fatima Z.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima'
    },
    price: 280,
    image: 'https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=800'
  };

  const serviceFee = Math.round(service.price * 0.15);
  const total = service.price + serviceFee;

  const handleNext = () => {
    if (currentStep === 'details') {
      setCurrentStep('payment');
      toast.success('Informations enregistrées');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
      toast.success('Paiement confirmé avec succès ! 🎉');
    }
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      onNavigate('service-detail', { id: 1 });
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-3xl mb-2">Confirmer et payer</h1>
          <p className="text-muted-foreground">
            Vous êtes presque prêt à réserver votre expérience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'details' ? 'bg-primary text-white' :
                currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-primary/20 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {currentStep === 'payment' || currentStep === 'confirmation' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  '1'
                )}
              </div>
              <span className={currentStep === 'details' ? 'text-primary' : 'text-muted-foreground'}>
                Détails
              </span>
            </div>

            <div className="w-16 h-0.5 bg-border"></div>

            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'payment' ? 'bg-primary text-white' :
                currentStep === 'confirmation' ? 'bg-primary/20 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {currentStep === 'confirmation' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  '2'
                )}
              </div>
              <span className={currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}>
                Paiement
              </span>
            </div>

            <div className="w-16 h-0.5 bg-border"></div>

            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'confirmation' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className={currentStep === 'confirmation' ? 'text-primary' : 'text-muted-foreground'}>
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Details */}
            {currentStep === 'details' && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl mb-6">Détails de la réservation</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Date et heure</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">Date</Label>
                          <Calendar
                            mode="single"
                            selected={bookingData.date}
                            onSelect={(date) => setBookingData({ ...bookingData, date: date || new Date() })}
                            className="rounded-md border"
                            disabled={(date) => date < new Date()}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">Heure</Label>
                          <select
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="guests" className="mb-2 block">Nombre de participants</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setBookingData({ ...bookingData, guests: Math.max(1, bookingData.guests - 1) })}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center">{bookingData.guests}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setBookingData({ ...bookingData, guests: Math.min(10, bookingData.guests + 1) })}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="mb-2 block">Message au Host (optionnel)</Label>
                      <Textarea
                        id="message"
                        placeholder="Présentez-vous et expliquez pourquoi vous souhaitez réserver cette expérience..."
                        value={bookingData.message}
                        onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl mb-4">Politique d'annulation</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Annulation gratuite jusqu'à 48h avant</strong>
                        <p className="text-muted-foreground">Remboursement intégral si vous annulez au moins 48 heures avant le début de l'expérience</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Remboursement partiel (50%) entre 24h et 48h</strong>
                        <p className="text-muted-foreground">Si vous annulez entre 24h et 48h avant</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Step 2: Payment */}
            {currentStep === 'payment' && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl mb-6">Informations de paiement</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Nom sur la carte</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={bookingData.cardName}
                        onChange={(e) => setBookingData({ ...bookingData, cardName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={bookingData.cardNumber}
                        onChange={(e) => setBookingData({ ...bookingData, cardNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Date d'expiration</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={bookingData.expiryDate}
                          onChange={(e) => setBookingData({ ...bookingData, expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={3}
                          value={bookingData.cvv}
                          onChange={(e) => setBookingData({ ...bookingData, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-2">Paiement sécurisé</h3>
                      <p className="text-sm text-muted-foreground">
                        Vos informations de paiement sont cryptées et sécurisées. Nous ne stockons jamais vos données bancaires. 
                        Le paiement est traité par notre partenaire certifié PCI-DSS.
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-secondary" />
                </div>
                <h2 className="text-3xl mb-4">Réservation confirmée !</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Votre réservation a été enregistrée avec succès
                </p>

                <Card className="p-6 max-w-md mx-auto mb-8 text-left">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Numéro de réservation</div>
                      <div className="text-xl">{bookingData.bookingId}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Date et heure</div>
                      <div>{bookingData.date.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} à {bookingData.time}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Participants</div>
                      <div>{bookingData.guests} personne{bookingData.guests > 1 ? 's' : ''}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Montant payé</div>
                      <div className="text-xl text-primary">{total} DH</div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Un email de confirmation a été envoyé à votre adresse. 
                    Le Host vous contactera prochainement pour finaliser les détails.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => onNavigate('messages')} variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contacter le Host
                    </Button>
                    <Button onClick={() => onNavigate('platform-home')}>
                      Retour à l'accueil
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Summary */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="mb-4">Récapitulatif</h3>
                
                <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 line-clamp-2">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Par {service.host.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {bookingData.date.toLocaleDateString('fr-FR', { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{bookingData.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{bookingData.guests} participant{bookingData.guests > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>{service.price} DH × {bookingData.guests}</span>
                    <span>{service.price * bookingData.guests} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frais de service</span>
                    <span>{serviceFee * bookingData.guests} DH</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span>Total</span>
                  <span className="text-xl text-primary">{total * bookingData.guests} DH</span>
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full"
                  disabled={currentStep === 'payment' && (!bookingData.cardName || !bookingData.cardNumber || !bookingData.expiryDate || !bookingData.cvv)}
                >
                  {currentStep === 'details' ? 'Continuer vers le paiement' : 'Confirmer et payer'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
