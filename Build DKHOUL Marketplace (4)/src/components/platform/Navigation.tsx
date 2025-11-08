import { Menu, Search, Heart, MessageSquare, User, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('platform-home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">د</span>
            </div>
            <div className="hidden md:block">
              <div className="text-primary text-xl">DKHOUL</div>
              <div className="text-xs text-muted-foreground -mt-1">Platform Demo</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => onNavigate('platform-home')}
              className={`hover:text-primary transition-colors ${
                currentPage === 'platform-home' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`hover:text-primary transition-colors ${
                currentPage === 'search' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Explorer
            </button>
            <button
              onClick={() => onNavigate('host-dashboard')}
              className={`hover:text-primary transition-colors ${
                currentPage === 'host-dashboard' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Devenir Host
            </button>
            <button
              onClick={() => onNavigate('investor-pitch')}
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Investisseurs
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem>🇲🇦 العربية</DropdownMenuItem>
                <DropdownMenuItem>🇬🇧 English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => onNavigate('messages')}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
            >
              <Heart className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate('profile')}>Mon Profil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('host-dashboard')}>Mes Services</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('messages')}>Messages</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('gateway')}>Retour à l'accueil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => onNavigate('platform-home')}
              className="hidden md:flex bg-accent hover:bg-accent/90"
            >
              S'inscrire
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
