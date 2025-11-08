import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { GatewayLanding } from './components/GatewayLanding';
import { InvestorPitch } from './components/investor/InvestorPitch';
import { Navigation } from './components/platform/Navigation';
import { Footer } from './components/platform/Footer';
import { HomePage } from './components/platform/HomePage';
import { SearchPage } from './components/platform/SearchPage';
import { ServiceDetailPage } from './components/platform/ServiceDetailPage';
import { BookingFlow } from './components/platform/BookingFlow';
import { HostDashboard } from './components/platform/HostDashboard';
import { ProfilePage } from './components/platform/ProfilePage';
import { MessagesPage } from './components/platform/MessagesPage';

type Page = 
  | 'gateway'
  | 'investor-pitch'
  | 'platform-home' 
  | 'search' 
  | 'service-detail' 
  | 'booking' 
  | 'host-dashboard' 
  | 'create-service' 
  | 'profile' 
  | 'messages' 
  | 'admin';

interface PageData {
  [key: string]: any;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('gateway');
  const [pageData, setPageData] = useState<PageData>({});

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as Page);
    if (data) {
      setPageData(data);
    }
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  };

  // Gateway Landing Page (Initial Choice)
  if (currentPage === 'gateway') {
    return <GatewayLanding onNavigate={handleNavigate} />;
  }

  // Investor Pitch Flow (no Navigation component)
  if (currentPage === 'investor-pitch') {
    return <InvestorPitch onNavigate={handleNavigate} />;
  }

  // Platform Demo Flow (with Navigation component)
  const isPlatformFlow = ['platform-home', 'search', 'service-detail', 'booking', 'host-dashboard', 'profile', 'messages'].includes(currentPage);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-background">
        {isPlatformFlow && (
          <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        )}
      
      {currentPage === 'platform-home' && (
        <HomePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'search' && (
        <SearchPage 
          onNavigate={handleNavigate}
          initialCategory={pageData.category}
        />
      )}

      {currentPage === 'service-detail' && (
        <ServiceDetailPage 
          onNavigate={handleNavigate}
          serviceId={pageData.id}
        />
      )}

      {currentPage === 'booking' && (
        <BookingFlow 
          onNavigate={handleNavigate}
          serviceData={pageData.service}
        />
      )}

      {currentPage === 'host-dashboard' && (
        <HostDashboard onNavigate={handleNavigate} />
      )}

      {currentPage === 'profile' && (
        <ProfilePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'messages' && (
        <MessagesPage onNavigate={handleNavigate} />
      )}

      {isPlatformFlow && currentPage !== 'messages' && <Footer onNavigate={handleNavigate} />}
      </div>
    </>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <button 
              onClick={() => onNavigate('gateway')}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">د</span>
              </div>
              <div>
                <div className="text-primary text-xl">DKHOUL</div>
              </div>
            </button>
            <p className="text-sm text-muted-foreground">
              La plateforme qui connecte touristes et locaux marocains pour des expériences authentiques.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => onNavigate('host-dashboard')} className="hover:text-primary transition-colors">
                  Pour les Hosts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('platform-home')} className="hover:text-primary transition-colors">
                  Pour les Voyageurs
                </button>
              </li>
              <li><a href="#" className="hover:text-primary transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sécurité & Confiance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => onNavigate('investor-pitch')} className="hover:text-primary transition-colors">
                  Investisseurs
                </button>
              </li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Presse</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 DKHOUL. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Facebook
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Instagram
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
