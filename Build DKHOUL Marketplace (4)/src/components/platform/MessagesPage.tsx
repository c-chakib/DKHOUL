import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Send, Search, Phone, Video, MoreVertical,
  Calendar, MapPin, Star, Image as ImageIcon,
  Paperclip, Smile, MessageSquare
} from 'lucide-react';

interface MessagesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Conversation {
  id: number;
  participant: {
    name: string;
    avatar: string;
    isHost: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
  service?: {
    title: string;
    date?: string;
  };
}

interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'booking';
  booking?: {
    service: string;
    date: string;
    time: string;
    guests: number;
    amount: number;
  };
}

export function MessagesPage({ onNavigate }: MessagesPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Conversation[] = [
    {
      id: 1,
      participant: {
        name: 'Sophie Martin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        isHost: false
      },
      lastMessage: 'Merci beaucoup ! À très bientôt 😊',
      timestamp: '10:30',
      unread: 0,
      service: {
        title: 'Atelier de Cuisine Marocaine',
        date: '2025-11-05'
      }
    },
    {
      id: 2,
      participant: {
        name: 'John Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        isHost: false
      },
      lastMessage: "Est-ce que l'espace a une bonne connexion WiFi ?",
      timestamp: 'Hier',
      unread: 2,
      service: {
        title: 'Espace Coworking avec Vue'
      }
    },
    {
      id: 3,
      participant: {
        name: 'Maria Garcia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        isHost: false
      },
      lastMessage: 'Parfait ! Je confirme ma réservation.',
      timestamp: 'Hier',
      unread: 0,
      service: {
        title: 'Guide Privé Médina de Fès',
        date: '2025-11-08'
      }
    },
    {
      id: 4,
      participant: {
        name: 'Ahmed M.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        isHost: true
      },
      lastMessage: 'Votre réservation est confirmée !',
      timestamp: '3 nov',
      unread: 0,
      service: {
        title: 'Cours de Poterie Berbère'
      }
    },
    {
      id: 5,
      participant: {
        name: 'Emma Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        isHost: false
      },
      lastMessage: 'Quels sont les ingrédients à apporter ?',
      timestamp: '2 nov',
      unread: 1,
      service: {
        title: 'Atelier de Cuisine Marocaine'
      }
    }
  ];

  const getMessages = (conversationId: number): Message[] => {
    if (conversationId === 1) {
      return [
        {
          id: 1,
          sender: 'other',
          content: 'Bonjour ! Je suis très intéressée par votre atelier de cuisine. Est-ce adapté aux débutants ?',
          timestamp: '09:15',
          type: 'text'
        },
        {
          id: 2,
          sender: 'me',
          content: 'Bonjour Sophie ! Oui absolument, mon atelier est parfait pour les débutants. Je vous guide pas à pas dans la préparation de plats traditionnels marocains.',
          timestamp: '09:18',
          type: 'text'
        },
        {
          id: 3,
          sender: 'other',
          content: 'Super ! Combien de personnes y aura-t-il dans le cours ?',
          timestamp: '09:20',
          type: 'text'
        },
        {
          id: 4,
          sender: 'me',
          content: 'Je limite à 4 personnes maximum pour garantir une expérience personnalisée et interactive.',
          timestamp: '09:22',
          type: 'text'
        },
        {
          id: 5,
          sender: 'other',
          content: "Parfait ! Je voudrais réserver pour 2 personnes le 5 novembre à 14h00. C'est possible ?",
          timestamp: '09:25',
          type: 'text'
        },
        {
          id: 6,
          sender: 'me',
          content: 'Oui, cette date est disponible ! Je vous envoie la confirmation de réservation.',
          timestamp: '09:28',
          type: 'text'
        },
        {
          id: 7,
          sender: 'me',
          content: '',
          timestamp: '09:28',
          type: 'booking',
          booking: {
            service: 'Atelier de Cuisine Marocaine',
            date: '5 novembre 2025',
            time: '14:00',
            guests: 2,
            amount: 560
          }
        },
        {
          id: 8,
          sender: 'other',
          content: 'Merci beaucoup ! À très bientôt 😊',
          timestamp: '10:30',
          type: 'text'
        }
      ];
    } else if (conversationId === 2) {
      return [
        {
          id: 1,
          sender: 'other',
          content: "Bonjour, je cherche un espace calme pour travailler. Votre coworking a l'air parfait !",
          timestamp: '14:20',
          type: 'text'
        },
        {
          id: 2,
          sender: 'me',
          content: "Bonjour John ! Merci pour votre intérêt. L'espace est effectivement très calme et lumineux, avec une belle vue sur la médina.",
          timestamp: '14:35',
          type: 'text'
        },
        {
          id: 3,
          sender: 'other',
          content: "Est-ce que l'espace a une bonne connexion WiFi ?",
          timestamp: '15:10',
          type: 'text'
        }
      ];
    }
    return [];
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const messages = getMessages(selectedConversation);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Send message logic here
      setMessageInput('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.service?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto px-4 h-full py-4">
        <div className="grid lg:grid-cols-3 gap-4 h-full">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <h1 className="text-2xl mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une conversation..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-3 rounded-lg mb-2 transition-colors text-left ${
                      selectedConversation === conv.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'hover:bg-muted border-2 border-transparent'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conv.participant.avatar} />
                          <AvatarFallback>{conv.participant.name[0]}</AvatarFallback>
                        </Avatar>
                        {conv.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={conv.unread > 0 ? '' : 'text-muted-foreground'}>
                              {conv.participant.name}
                            </span>
                            {conv.participant.isHost && (
                              <Badge variant="outline" className="text-xs">Host</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                        </div>
                        {conv.service && (
                          <div className="text-xs text-muted-foreground mb-1 truncate">
                            {conv.service.title}
                          </div>
                        )}
                        <div className={`text-sm truncate ${
                          conv.unread > 0 ? '' : 'text-muted-foreground'
                        }`}>
                          {conv.lastMessage}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          {currentConversation ? (
            <Card className="lg:col-span-2 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={currentConversation.participant.avatar} />
                      <AvatarFallback>{currentConversation.participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="flex items-center gap-2">
                        {currentConversation.participant.name}
                        {currentConversation.participant.isHost && (
                          <Badge variant="outline" className="text-xs">Host</Badge>
                        )}
                      </h2>
                      {currentConversation.service && (
                        <div className="text-sm text-muted-foreground">
                          {currentConversation.service.title}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {currentConversation.service?.date && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      Réservation confirmée pour le{' '}
                      {new Date(currentConversation.service.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'booking' && message.booking ? (
                        <Card className="p-4 max-w-sm bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>Confirmation de réservation</span>
                          </div>
                          <Separator className="my-3" />
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Service:</span>
                              <div>{message.booking.service}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-muted-foreground">Date:</span>
                                <div>{message.booking.date}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Heure:</span>
                                <div>{message.booking.time}</div>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Participants:</span>
                              <div>{message.booking.guests} personne{message.booking.guests > 1 ? 's' : ''}</div>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center">
                              <span>Total:</span>
                              <span className="text-xl text-primary">{message.booking.amount} DH</span>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <div className="flex items-end gap-2 max-w-[70%]">
                          {message.sender === 'other' && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={currentConversation.participant.avatar} />
                              <AvatarFallback>{currentConversation.participant.name[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                message.sender === 'me'
                                  ? 'bg-primary text-white'
                                  : 'bg-muted'
                              }`}
                            >
                              {message.content}
                            </div>
                            <div className={`text-xs text-muted-foreground mt-1 ${
                              message.sender === 'me' ? 'text-right' : 'text-left'
                            }`}>
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Écrivez votre message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="lg:col-span-2 flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
