import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavigate = (page: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <button
              onClick={() => handleNavigate('gateway')}
              className="text-2xl mb-4 hover:text-primary transition-colors"
            >
              DKHOUL
            </button>
            <p className="text-sm text-muted-foreground mb-4">
              La première plateforme marocaine qui connecte les touristes avec les locaux pour des micro-services authentiques.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    handleNavigate('search');
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  DKHOUL Space
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNavigate('search');
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  DKHOUL Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNavigate('search');
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  DKHOUL Connect
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('host-dashboard')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Devenir Host
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigate('investor-pitch')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('investor-pitch')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Investisseurs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('platform-home')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('messages')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Aide & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Médina, Marrakech<br />Maroc</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+212612345678" className="hover:text-primary transition-colors">
                  +212 6 12 34 56 78
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contact@dkhoul.ma" className="hover:text-primary transition-colors">
                  contact@dkhoul.ma
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 DKHOUL. Tous droits réservés.
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <button
                onClick={() => handleNavigate('platform-home')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Conditions d'utilisation
              </button>
              <button
                onClick={() => handleNavigate('platform-home')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Politique de confidentialité
              </button>
              <button
                onClick={() => handleNavigate('platform-home')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Mentions légales
              </button>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                🇲🇦 Fait au Maroc
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
