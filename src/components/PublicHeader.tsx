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
    <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(11,15,25,0.8)', backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ display: 'flex', alignItems: 'baseline', gap: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 500, letterSpacing: '-0.02em', color: '#E8E6E3' }}>
              {authorName}
            </span>
            <span style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Carnets
            </span>
          </button>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <button
              onClick={() => onNavigate('recherches')}
              style={{
                fontSize: '14px',
                color: currentView === 'recherches' ? '#E8E6E3' : '#9BA3B5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Recherches
            </button>
            <button
              onClick={() => onNavigate('decouvertes')}
              style={{
                fontSize: '14px',
                color: currentView === 'decouvertes' ? '#E8E6E3' : '#9BA3B5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Découvertes
            </button>
            <button
              onClick={() => onNavigate('articles')}
              style={{
                fontSize: '14px',
                color: currentView === 'articles' ? '#E8E6E3' : '#9BA3B5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Articles
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onNewsletterClick}
              style={{
                fontSize: '14px',
                color: '#9BA3B5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E8E6E3'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9BA3B5'}
            >
              Newsletter
            </button>
            <a
              href="mailto:ernongoy@gmail.com"
              style={{
                fontSize: '14px',
                color: '#9BA3B5',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E8E6E3'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9BA3B5'}
            >
              Contact
            </a>
            <button
              onClick={onLoginClick}
              style={{
                fontSize: '14px',
                color: '#9BA3B5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E8E6E3'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9BA3B5'}
            >
              {isLoggedIn ? 'Espace auteur' : 'Connexion'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
