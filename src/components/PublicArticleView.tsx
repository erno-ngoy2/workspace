import { Article } from '../types';

interface PublicArticleViewProps {
  article: Article;
  onBack: () => void;
  authorName: string;
}

function parseContent(content: string): React.ReactNode[] {
  const paragraphs = content.split('\n').filter(p => p.trim());

  return paragraphs.map((paragraph, pIndex) => {
    const elements: React.ReactNode[] = [];
    const regex = /(!?\[([^\]]*)\]\(([^)]+)\))|(\bhttps?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        elements.push(paragraph.substring(lastIndex, match.index));
      }

      if (match[1]) {
        const isImage = match[1].startsWith('!');
        const altText = match[2];
        const url = match[3];

        if (isImage) {
          elements.push(
            <span key={`img-${pIndex}-${match.index}`} style={{ display: 'block', margin: '32px 0' }}>
              <img
                src={url}
                alt={altText || ''}
                style={{ width: '100%', borderRadius: '2px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {altText && (
                <p style={{ color: '#5C6478', fontSize: '12px', marginTop: '12px', fontStyle: 'italic' }}>{altText}</p>
              )}
            </span>
          );
        } else {
          elements.push(
            <a
              key={`link-${pIndex}-${match.index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4A6FA5', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              {altText || url}
            </a>
          );
        }
      } else if (match[4]) {
        const url = match[4];
        elements.push(
          <a
            key={`url-${pIndex}-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4A6FA5', textDecoration: 'underline', textUnderlineOffset: '2px', wordBreak: 'break-all' }}
          >
            {url}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < paragraph.length) {
      elements.push(paragraph.substring(lastIndex));
    }

    return (
      <p
        key={pIndex}
        style={{
          color: 'rgba(232, 230, 227, 0.9)',
          lineHeight: 1.8,
          marginBottom: '24px',
          fontSize: pIndex === 0 ? '20px' : '18px'
        }}
      >
        {elements.length > 0 ? elements : paragraph}
      </p>
    );
  });
}

export default function PublicArticleView({
  article,
  onBack,
  authorName,
}: PublicArticleViewProps) {
  const date = new Date(article.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const categoryLabel = {
    recherche: 'Recherche',
    decouverte: 'Découverte',
    article: 'Article',
  };

  const renderedContent = parseContent(article.content);

  return (
    <article style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px 0' }}>
        <button
          onClick={onBack}
          style={{ color: '#9BA3B5', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Retour aux notes
        </button>
      </div>

      <header style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <span style={{ color: '#4A6FA5', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
            {categoryLabel[article.category]}
          </span>
          <span style={{ color: '#3D4557' }}>—</span>
          <time style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'capitalize' }}>
            {date}
          </time>
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 300, lineHeight: 1.1, color: '#E8E6E3', marginBottom: '32px' }}>
          {article.title}
        </h1>

        {article.excerpt && (
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#9BA3B5', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.5, marginBottom: '40px', maxWidth: '700px' }}>
            {article.excerpt}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1A2033', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', color: '#E8E6E3' }}>
              {authorName.charAt(0)}
            </span>
          </div>
          <div>
            <p style={{ color: '#E8E6E3', fontSize: '14px' }}>{authorName}</p>
            <p style={{ color: '#5C6478', fontSize: '12px' }}>Auteur</p>
          </div>
        </div>
      </header>

      {article.images && article.images.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
          <img
            src={article.images[0]}
            alt={article.title}
            style={{ width: '100%', borderRadius: '2px' }}
          />
        </div>
      )}

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px' }}>
        {renderedContent}

        {article.tags.length > 0 && (
          <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Mots-clés
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{ fontSize: '12px', color: '#9BA3B5', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '2px' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onBack}
          style={{ color: '#9BA3B5', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Retour aux notes
        </button>
      </div>
    </article>
  );
}
