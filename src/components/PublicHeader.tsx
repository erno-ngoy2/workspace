import { MailIcon } from './Icons';

interface PublicHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLoginClick: () => void;
  onNewsletterClick: () => void;
  isLoggedIn: boolean;
  authorName: string;
}

export default function PublicHeader({
  currentView,
  onNavigate,
  onLoginClick,
  onNewsletterClick,
  isLoggedIn,
  authorName,
}: PublicHeaderProps) {
  return (
    <header className="border-b border-white/[0.06] sticky top-0 z-40 backdrop-blur-md bg-[#0B0F19]/80">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Nom */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-baseline gap-3 group"
          >
            <span className="font-display text-xl md:text-2xl font-medium tracking-tight text-[#E8E6E3] group-hover:text-white transition-colors">
              {authorName}
            </span>
            <span className="hidden sm:inline text-[#5C6478] text-xs tracking-[0.2em] uppercase">
              Carnets
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('recherches')}
              className={`text-sm transition-colors link-underline ${
                currentView === 'recherches' ? 'text-[#E8E6E3]' : 'text-[#9BA3B5] hover:text-[#E8E6E3]'
              }`}
            >
              Recherches
            </button>
            <button
              onClick={() => onNavigate('decouvertes')}
              className={`text-sm transition-colors link-underline ${
                currentView === 'decouvertes' ? 'text-[#E8E6E3]' : 'text-[#9BA3B5] hover:text-[#E8E6E3]'
              }`}
            >
              Découvertes
            </button>
            <button
              onClick={() => onNavigate('articles')}
              className={`text-sm transition-colors link-underline ${
                currentView === 'articles' ? 'text-[#E8E6E3]' : 'text-[#9BA3B5] hover:text-[#E8E6E3]'
              }`}
            >
              Articles
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNewsletterClick}
              className="hidden sm:inline-flex items-center gap-2 text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline"
            >
              <MailIcon size={14} />
              Newsletter
            </button>
            <a
              href="mailto:ernongoy@gmail.com"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline"
            >
              Contact
            </a>
            <button
              onClick={onLoginClick}
              className="text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors"
            >
              {isLoggedIn ? 'Espace auteur' : 'Connexion'}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-5 pb-3 overflow-x-auto">
          <button
            onClick={() => onNavigate('recherches')}
            className={`text-xs tracking-wide whitespace-nowrap ${
              currentView === 'recherches' ? 'text-[#E8E6E3]' : 'text-[#9BA3B5]'
            }`}
          >
            Recherches
          </button>
          <button
            onClick={() => onNavigate('decouvertes')}
            className={`text-xs tracking-wide whitespace-nowrap ${
              currentView === 'decouvertes' ? 'text-[#E8E6E3]' : 'text-[#9BA3B5]'
            }`}
          >
            Découvertes
          </button>
          <button
            onClick={() => onNavigate('articles')}
            className={`text-xs tracking-wide whitespace-nowrap ${
              currentView === 'articles' ? 'text-[#E8E6E3]' : 'text-[#9BA3B5]'
            }`}
          >
            Articles
          </button>
          <button
            onClick={onNewsletterClick}
            className="text-xs tracking-wide text-[#9BA3B5] whitespace-nowrap"
          >
            Newsletter
          </button>
          <a
            href="mailto:ernongoy@gmail.com"
            className="text-xs tracking-wide text-[#9BA3B5] whitespace-nowrap"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
