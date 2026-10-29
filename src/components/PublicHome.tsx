import { Article } from '../types';

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
    <div style={{ minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '96px 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
          <div>
            <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Carnets de recherche
            </p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, lineHeight: 1.05, color: '#E8E6E3', marginBottom: '32px' }}>
              Notes, observations et fragments d'un travail en cours.
            </h1>
            <p style={{ color: '#9BA3B5', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px' }}>
              {authorBio || `Un espace où je consigne ce que je cherche, ce que je trouve, et ce que j'apprends en chemin.`}
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent)' }}></div>

      {/* FEATURED ARTICLE */}
      {featured && (
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '96px 24px' }}>
          <article>
            <button
              onClick={() => onArticleClick(featured)}
              style={{ display: 'block', textAlign: 'left', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {featured.images && featured.images.length > 0 && (
                <div style={{ marginBottom: '32px', overflow: 'hidden', borderRadius: '2px' }}>
                  <img
                    src={featured.images[0]}
                    alt={featured.title}
                    style={{ width: '100%', height: '400px', objectFit: 'cover', transition: 'transform 0.7s' }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <span style={{ color: '#4A6FA5', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {categoryLabel[featured.category]}
                </span>
                <span style={{ color: '#3D4557' }}>—</span>
                <time style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.05em' }}>
                  {formatDate(featured.date)}
                </time>
              </div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, color: '#E8E6E3', marginBottom: '24px' }}>
                {featured.title}
              </h2>
              <p style={{ color: '#9BA3B5', fontSize: '18px', lineHeight: 1.6, maxWidth: '700px', marginBottom: '24px' }}>
                {featured.excerpt}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#E8E6E3' }}>
                Lire la note →
              </span>
            </button>
          </article>
        </section>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent)' }}></div>

      {/* RECENT ARTICLES */}
      {rest.length > 0 && (
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '96px 24px' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Récemment
            </p>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 300, color: '#E8E6E3' }}>
              Notes publiées
            </h2>
          </div>
          <div>
            {rest.map((article, index) => (
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
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '32px', alignItems: 'baseline' }}>
                  <span style={{ color: '#3D4557', fontSize: '14px', fontFamily: 'Fraunces, serif' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 300, color: '#E8E6E3', lineHeight: 1.3, marginBottom: '8px' }}>
                      {article.title}
                    </h3>
                    <p style={{ color: '#9BA3B5', fontSize: '14px', lineHeight: 1.6 }}>
                      {article.excerpt}
                    </p>
                  </div>
                  <time style={{ color: '#5C6478', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {formatDate(article.date)}
                  </time>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {articles.length === 0 && (
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '128px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#9BA3B5', fontWeight: 300 }}>
            Aucune note publiée pour le moment.
          </p>
          <p style={{ color: '#5C6478', fontSize: '14px', marginTop: '16px' }}>
            Les carnets seront bientôt remplis.
          </p>
        </section>
      )}
    </div>
  );
}
