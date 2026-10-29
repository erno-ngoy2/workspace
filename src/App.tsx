import { useState, useEffect } from 'react';
import { Author, Article, AUTHOR_EMAIL } from './types';
import Auth from './components/Auth';
import PublicHeader from './components/PublicHeader';
import PublicHome from './components/PublicHome';
import PublicArticleView from './components/PublicArticleView';
import AuthorDashboard from './components/AuthorDashboard';
import ReaderSignup from './components/ReaderSignup';

export default function App() {
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showReaderSignup, setShowReaderSignup] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem('blog_session');
      if (session) {
        setAuthor(JSON.parse(session));
      }
      const stored = localStorage.getItem('blog_articles');
      if (stored) {
        setArticles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur de chargement:', error);
    }
  }, []);

  const handleLogin = (a: Author) => {
    setAuthor(a);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('blog_session');
    setAuthor(null);
    setCurrentView('home');
    setSelectedArticle(null);
  };

  const handleSaveArticle = (article: Article) => {
    let updated: Article[];
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      updated = [...articles];
      updated[idx] = article;
    } else {
      updated = [article, ...articles];
    }
    setArticles(updated);
    localStorage.setItem('blog_articles', JSON.stringify(updated));
  };

  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    localStorage.setItem('blog_articles', JSON.stringify(updated));
    setSelectedArticle(null);
    setCurrentView('home');
  };

  const handleUpdateAuthor = (a: Author) => {
    setAuthor(a);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedArticle(null);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo(0, 0);
  };

  if (showAuth && !author) {
    return <Auth onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
  }

  if (showReaderSignup) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <button
            onClick={() => setShowReaderSignup(false)}
            style={{ color: '#9BA3B5', fontSize: '14px', marginBottom: '48px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Retour au blog
          </button>
          <ReaderSignup />
        </div>
      </div>
    );
  }

  if (author && author.email === AUTHOR_EMAIL && (currentView === 'dashboard' || currentView === 'write' || currentView === 'profile' || currentView === 'newsletter')) {
    return (
      <AuthorDashboard
        author={author}
        articles={articles}
        onLogout={handleLogout}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onUpdateAuthor={handleUpdateAuthor}
        onArticleClick={handleArticleClick}
        onBackToPublic={() => setCurrentView('home')}
      />
    );
  }

  const filteredArticles = articles.filter(article => {
    if (currentView === 'recherches') return article.category === 'recherche';
    if (currentView === 'decouvertes') return article.category === 'decouverte';
    if (currentView === 'articles') return article.category === 'article';
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19' }}>
      <PublicHeader
        currentView={currentView}
        onNavigate={handleNavigate}
        onLoginClick={() => {
          if (author) {
            setCurrentView('dashboard');
          } else {
            setShowAuth(true);
          }
        }}
        onNewsletterClick={() => setShowReaderSignup(true)}
        isLoggedIn={!!author}
        authorName={author?.name || 'Erno Ngoy'}
      />

      {currentView === 'article' && selectedArticle ? (
        <PublicArticleView
          article={selectedArticle}
          onBack={() => handleNavigate('home')}
          authorName={author?.name || 'Erno Ngoy'}
        />
      ) : currentView === 'home' ? (
        <PublicHome
          articles={articles}
          onArticleClick={handleArticleClick}
          onNavigate={handleNavigate}
          authorName={author?.name || 'Erno Ngoy'}
          authorBio={author?.bio}
        />
      ) : (
        <CategoryView
          view={currentView}
          articles={filteredArticles}
          onArticleClick={handleArticleClick}
        />
      )}

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '80px', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ color: '#9BA3B5', fontSize: '14px', marginBottom: '16px' }}>
            {author?.name || 'Erno Ngoy'}
          </p>
          <p style={{ color: '#5C6478', fontSize: '12px' }}>
            © {new Date().getFullYear()} Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

function CategoryView({ view, articles, onArticleClick }: { view: string; articles: Article[]; onArticleClick: (a: Article) => void }) {
  const titles: Record<string, { title: string; description: string }> = {
    recherches: { title: 'Recherches', description: 'Travaux en cours, lectures approfondies.' },
    decouvertes: { title: 'Découvertes', description: 'Ce que j\'ai trouvé et veux partager.' },
    articles: { title: 'Articles', description: 'Textes plus longs et réflexions abouties.' },
  };

  const config = titles[view] || titles.articles;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '48px', fontWeight: 300, color: '#E8E6E3', marginBottom: '16px' }}>
        {config.title}
      </h1>
      <p style={{ color: '#9BA3B5', fontSize: '18px', marginBottom: '64px' }}>
        {config.description}
      </p>

      {articles.length === 0 ? (
        <p style={{ color: '#9BA3B5', textAlign: 'center', padding: '64px 0' }}>
          Aucune note dans cette catégorie.
        </p>
      ) : (
        <div>
          {articles.map((article, index) => (
            <button
              key={article.id}
              onClick={() => onArticleClick(article)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '32px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 300, color: '#E8E6E3', marginBottom: '8px' }}>
                {article.title}
              </h2>
              <p style={{ color: '#9BA3B5', fontSize: '14px' }}>
                {article.excerpt}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
