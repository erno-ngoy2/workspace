import { Article } from '../types';
import { ArrowRightIcon } from './Icons';

interface PublicHomeProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  onNavigate: (view: string) => void;
  authorName: string;
  authorBio?: string;
}

export default function PublicHome({
  articles,
  onArticleClick,
  onNavigate,
  authorName,
  authorBio,
}: PublicHomeProps) {
  const featured = articles.find(a => a.featured) || articles[0];
  const rest = articles.filter(a => a.id !== featured?.id).slice(0, 5);
  const recherches = articles.filter(a => a.category === 'recherche').slice(0, 3);
  const decouvertes = articles.filter(a => a.category === 'decouverte').slice(0, 3);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const categoryLabel = {
    recherche: 'Recherche',
    decouverte: 'Découverte',
    article: 'Article',
  };

  return (
    <div className="min-h-screen">
      {/* HERO — Editorial, asymmetric */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="text-[#5C6478] text-xs tracking-[0.3em] uppercase mb-6">
              Carnets de recherche
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-[#E8E6E3] text-balance mb-8">
              Notes, observations et fragments d'un travail en cours.
            </h1>
            <p className="text-[#9BA3B5] text-base md:text-lg leading-relaxed max-w-xl">
              {authorBio || `Un espace où je consigne ce que je cherche, ce que je trouve, et ce que j'apprends en chemin.`}
            </p>
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <div className="border-l border-white/[0.06] pl-6 md:pl-8">
              <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-3">
                À propos
              </p>
              <p className="font-display text-xl md:text-2xl text-[#E8E6E3] font-light italic leading-snug">
                « Ce qui m'intéresse, c'est moins le résultat que la manière dont on y arrive. »
              </p>
              <p className="text-[#9BA3B5] text-sm mt-4">
                — {authorName}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="hr-editorial max-w-[1400px] mx-auto"></div>

      {/* FEATURED ARTICLE — Large, asymmetric */}
      {featured && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-2 lg:pt-2">
              <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase">
                À la une
              </p>
            </div>
            <article className="lg:col-span-10">
              <button
                onClick={() => onArticleClick(featured)}
                className="text-left group w-full"
              >
                {featured.images && featured.images.length > 0 && (
                  <div className="mb-8 overflow-hidden rounded-sm">
                    <img
                      src={featured.images[0]}
                      alt={featured.title}
                      className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-[#4A6FA5] text-xs tracking-[0.2em] uppercase font-medium">
                    {categoryLabel[featured.category]}
                  </span>
                  <span className="text-[#3D4557]">—</span>
                  <time className="text-[#5C6478] text-xs tracking-wide">
                    {formatDate(featured.date)}
                  </time>
                </div>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] text-[#E8E6E3] mb-6 group-hover:text-white transition-colors text-balance">
                  {featured.title}
                </h2>
                <p className="text-[#9BA3B5] text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-[#E8E6E3] group-hover:gap-3 transition-all">
                  Lire la note
                  <ArrowRightIcon size={14} className="inline-block transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </article>
          </div>
        </section>
      )}

      <div className="hr-editorial max-w-[1400px] mx-auto"></div>

      {/* RECENT ARTICLES — Asymmetric grid */}
      {rest.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-3">
              <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-3">
                Récemment
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-light text-[#E8E6E3]">
                Notes publiées
              </h2>
            </div>
            <div className="lg:col-span-9">
              <div className="space-y-0">
                {rest.map((article, index) => (
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
                      <div className="md:col-span-7">
                        <h3 className="font-display text-xl md:text-2xl font-light text-[#E8E6E3] group-hover:text-white transition-colors leading-snug mb-2">
                          {article.title}
                        </h3>
                        <p className="text-[#9BA3B5] text-sm leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-[#5C6478] text-xs tracking-wide">
                          {categoryLabel[article.category]}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <time className="text-[#5C6478] text-xs">
                          {formatDate(article.date)}
                        </time>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES SECTION — Asymmetric */}
      {(recherches.length > 0 || decouvertes.length > 0) && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Recherches */}
            {recherches.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-white/[0.06]">
                  <h2 className="font-display text-2xl font-light text-[#E8E6E3]">
                    Recherches
                  </h2>
                  <button
                    onClick={() => onNavigate('recherches')}
                    className="text-xs text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline"
                  >
                    Tout voir
                  </button>
                </div>
                <div className="space-y-6">
                  {recherches.map(article => (
                    <button
                      key={article.id}
                      onClick={() => onArticleClick(article)}
                      className="block text-left group w-full"
                    >
                      <h3 className="font-display text-lg text-[#E8E6E3] group-hover:text-white transition-colors leading-snug mb-1">
                        {article.title}
                      </h3>
                      <time className="text-[#5C6478] text-xs">{formatDate(article.date)}</time>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Découvertes */}
            {decouvertes.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-white/[0.06]">
                  <h2 className="font-display text-2xl font-light text-[#E8E6E3]">
                    Découvertes
                  </h2>
                  <button
                    onClick={() => onNavigate('decouvertes')}
                    className="text-xs text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline"
                  >
                    Tout voir
                  </button>
                </div>
                <div className="space-y-6">
                  {decouvertes.map(article => (
                    <button
                      key={article.id}
                      onClick={() => onArticleClick(article)}
                      className="block text-left group w-full"
                    >
                      <h3 className="font-display text-lg text-[#E8E6E3] group-hover:text-white transition-colors leading-snug mb-1">
                        {article.title}
                      </h3>
                      <time className="text-[#5C6478] text-xs">{formatDate(article.date)}</time>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {articles.length === 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-32 text-center">
          <p className="font-display text-2xl md:text-3xl text-[#9BA3B5] font-light">
            Aucune note publiée pour le moment.
          </p>
          <p className="text-[#5C6478] text-sm mt-4">
            Les carnets seront bientôt remplis.
          </p>
        </section>
      )}
    </div>
  );
}
