import { useState, useEffect } from 'react';
import { Author, Article, ViewMode, AUTHOR_EMAIL } from './types';
import { ArrowRightIcon, MailIcon } from './components/Icons';
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

  // Load author session
  useEffect(() => {
    const session = localStorage.getItem('blog_session');
    if (session) {
      setAuthor(JSON.parse(session));
    }
    loadArticles();
  }, []);

  const loadArticles = () => {
    const stored = localStorage.getItem('blog_articles');
    if (stored) {
      setArticles(JSON.parse(stored));
    }
  };

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

  // If showing auth screen
  if (showAuth && !author) {
    return <Auth onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
  }

  // If showing reader signup
  if (showReaderSignup) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => setShowReaderSignup(false)}
            className="text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline mb-12"
          >
            ← Retour au blog
          </button>
          <ReaderSignup />
        </div>
      </div>
    );
  }

  // If logged in as author — show dashboard
  if (author && author.email === AUTHOR_EMAIL && currentView !== 'home' && currentView !== 'article' && currentView !== 'recherches' && currentView !== 'decouvertes' && currentView !== 'articles') {
    // Check if we're in dashboard mode
    if (currentView === 'dashboard' || currentView === 'write' || currentView === 'profile' || currentView === 'newsletter') {
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
  }

  // Public view
  const filteredArticles = articles.filter(article => {
    if (currentView === 'recherches') return article.category === 'recherche';
    if (currentView === 'decouvertes') return article.category === 'decouverte';
    if (currentView === 'articles') return article.category === 'article';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19]">
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

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <p className="font-display text-xl text-[#E8E6E3] mb-4">
                {author?.name || 'Erno Ngoy'}
              </p>
              <p className="text-[#9BA3B5] text-sm leading-relaxed max-w-sm">
                {author?.bio || 'Carnets de recherche, notes de lecture et fragments de pensée.'}
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="text-[#5C6478] text-xs uppercase tracking-[0.2em] mb-4">
                Navigation
              </p>
              <nav className="space-y-2">
                <button onClick={() => handleNavigate('home')} className="block text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors">
                  Accueil
                </button>
                <button onClick={() => handleNavigate('recherches')} className="block text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors">
                  Recherches
                </button>
                <button onClick={() => handleNavigate('decouvertes')} className="block text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors">
                  Découvertes
                </button>
                <button onClick={() => handleNavigate('articles')} className="block text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors">
                  Articles
                </button>
              </nav>
            </div>
            <div className="md:col-span-4">
              <p className="text-[#5C6478] text-xs uppercase tracking-[0.2em] mb-4">
                Contact
              </p>
              <a
                href="mailto:ernongoy@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-[#E8E6E3] hover:text-white transition-colors link-underline"
              >
                ernongoy@gmail.com
                <ArrowRightIcon size={14} className="text-[#4A6FA5]" />
              </a>
              <p className="text-[#5C6478] text-xs mt-4 leading-relaxed">
                Pour toute question, collaboration ou simplement échanger.
              </p>
            </div>
          </div>
          <div className="hr-editorial mt-12 mb-6"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[#3D4557] text-xs">
              © {new Date().getFullYear()} {author?.name || 'Erno Ngoy'}. Tous droits réservés.
            </p>
            <p className="text-[#3D4557] text-xs">
              Carnets personnels — Publication restreinte
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================
   CATEGORY VIEW
   ============================================ */
function CategoryView({
  view,
  articles,
  onArticleClick,
}: {
  view: string;
  articles: Article[];
  onArticleClick: (a: Article) => void;
}) {
  const titles: Record<string, { title: string; description: string }> = {
    recherches: {
      title: 'Recherches',
      description: 'Travaux en cours, lectures approfondies, notes de terrain.',
    },
    decouvertes: {
      title: 'Découvertes',
      description: 'Ce que j\'ai trouvé, ce qui m\'a surpris, ce que je veux partager.',
    },
    articles: {
      title: 'Articles',
      description: 'Textes plus longs, réflexions abouties, publications.',
    },
  };

  const config = titles[view] || titles.articles;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
        <div className="lg:col-span-4">
          <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-4">
            Catégorie
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#E8E6E3] leading-tight">
            {config.title}
          </h1>
        </div>
        <div className="lg:col-span-8 lg:pt-3">
          <p className="text-[#9BA3B5] text-base md:text-lg leading-relaxed max-w-xl">
            {config.description}
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-xl text-[#9BA3B5] font-light">
            Aucune note dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {articles.map((article, index) => (
            <button
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="group block w-full text-left py-8 border-t border-white/[0.06] hover:bg-white/[0.01] transition-colors -mx-4 px-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                <div className="md:col-span-1">
                  <span className="text-[#3D4557] text-sm font-display">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-8">
                  <h2 className="font-display text-xl md:text-2xl font-light text-[#E8E6E3] group-hover:text-white transition-colors leading-snug mb-2">
                    {article.title}
                  </h2>
                  <p className="text-[#9BA3B5] text-sm leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <time className="text-[#5C6478] text-xs">
                    {formatDate(article.date)}
                  </time>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
