import { Article } from '../types';
import { ArrowLeftIcon } from './Icons';

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
            <span key={`img-${pIndex}-${match.index}`} className="block my-8">
              <img
                src={url}
                alt={altText || ''}
                className="w-full rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {altText && (
                <p className="text-[#5C6478] text-xs mt-3 italic">{altText}</p>
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
              className="text-[#4A6FA5] hover:text-[#5A82BE] underline underline-offset-2 decoration-[#4A6FA5]/30 hover:decoration-[#5A82BE]/50 transition-colors"
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
            className="text-[#4A6FA5] hover:text-[#5A82BE] underline underline-offset-2 decoration-[#4A6FA5]/30 hover:decoration-[#5A82BE]/50 transition-colors break-all"
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
        className={`text-[#E8E6E3]/90 leading-[1.8] mb-6 ${
          pIndex === 0 ? 'text-lg md:text-xl' : 'text-base md:text-lg'
        }`}
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
    <article className="min-h-screen">
      {/* Back */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline"
        >
          <ArrowLeftIcon size={14} />
          Retour aux notes
        </button>
      </div>

      {/* Article header — editorial */}
      <header className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[#4A6FA5] text-xs tracking-[0.2em] uppercase font-medium">
            {categoryLabel[article.category]}
          </span>
          <span className="text-[#3D4557]">—</span>
          <time className="text-[#5C6478] text-xs tracking-wide capitalize">
            {date}
          </time>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-[#E8E6E3] mb-8 text-balance">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="font-display text-xl md:text-2xl text-[#9BA3B5] font-light italic leading-relaxed mb-10 max-w-2xl">
            {article.excerpt}
          </p>
        )}

        {/* Author line */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
          <div className="w-10 h-10 rounded-full bg-[#1A2033] border border-white/[0.08] flex items-center justify-center">
            <span className="font-display text-sm text-[#E8E6E3]">
              {authorName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-[#E8E6E3] text-sm">{authorName}</p>
            <p className="text-[#5C6478] text-xs">Auteur</p>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {article.images && article.images.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-12">
          <img
            src={article.images[0]}
            alt={article.title}
            className="w-full rounded-sm"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-[720px] mx-auto px-6 md:px-10 lg:px-16 pb-20">
        <div className="drop-cap">
          {renderedContent}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-4">
              Mots-clés
            </p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs text-[#9BA3B5] border border-white/[0.08] px-3 py-1.5 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attached images */}
        {article.images && article.images.length > 1 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-full rounded-sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-12 border-t border-white/[0.06]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline"
        >
          <ArrowLeftIcon size={14} />
          Retour aux notes
        </button>
      </div>
    </article>
  );
}
