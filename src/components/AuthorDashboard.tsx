import { useState, useRef } from 'react';
import { Article, Author } from '../types';
import { LinkIcon, ImageIcon, UploadIcon, EditIcon, TrashIcon, PlusIcon, PenIcon, HomeIcon, UserIcon, LogoutIcon, CheckIcon, AlertIcon, FileIcon, MailIcon } from './Icons';
import { sendNewArticleNotification, getSubscribers } from '../services/newsletter';
import NewsletterManager from './NewsletterManager';
import NewsletterCounter from './NewsletterCounter';

interface AuthorDashboardProps {
  author: Author;
  articles: Article[];
  onLogout: () => void;
  onSaveArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onUpdateAuthor: (author: Author) => void;
  onArticleClick: (article: Article) => void;
  onBackToPublic: () => void;
}

type DashboardView = 'list' | 'write' | 'profile' | 'newsletter';

export default function AuthorDashboard({
  author,
  articles,
  onLogout,
  onSaveArticle,
  onDeleteArticle,
  onUpdateAuthor,
  onArticleClick,
  onBackToPublic,
}: AuthorDashboardProps) {
  const [view, setView] = useState<DashboardView>('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setView('write');
  };

  const handleNew = () => {
    setEditingArticle(null);
    setView('write');
  };

  const handleSave = async (article: Article) => {
    onSaveArticle(article);
    setEditingArticle(null);
    setView('list');
    
    // Envoie un email aux abonnés de la newsletter
    const subscribers = getSubscribers();
    if (subscribers.length > 0) {
      const articleUrl = `${window.location.origin}/#/article/${article.id}`;
      const result = await sendNewArticleNotification(
        article.title,
        article.excerpt,
        articleUrl
      );
      
      // Affiche une notification (pourrait être amélioré avec un toast)
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Dashboard header */}
      <header className="border-b border-white/[0.06] sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={onBackToPublic}
                className="font-display text-lg text-[#E8E6E3] hover:text-white transition-colors"
              >
                {author.name}
              </button>
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                    view === 'list' ? 'text-[#E8E6E3]' : 'text-[#5C6478] hover:text-[#9BA3B5]'
                  }`}
                >
                  <FileIcon size={14} />
                  Notes
                </button>
                <button
                  onClick={handleNew}
                  className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                    view === 'write' ? 'text-[#E8E6E3]' : 'text-[#5C6478] hover:text-[#9BA3B5]'
                  }`}
                >
                  <PenIcon size={14} />
                  Écrire
                </button>
                <button
                  onClick={() => setView('newsletter')}
                  className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                    view === 'newsletter' ? 'text-[#E8E6E3]' : 'text-[#5C6478] hover:text-[#9BA3B5]'
                  }`}
                >
                  <MailIcon size={14} />
                  Newsletter
                </button>
                <button
                  onClick={() => setView('profile')}
                  className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                    view === 'profile' ? 'text-[#E8E6E3]' : 'text-[#5C6478] hover:text-[#9BA3B5]'
                  }`}
                >
                  <UserIcon size={14} />
                  Profil
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToPublic}
                className="text-xs text-[#5C6478] hover:text-[#9BA3B5] transition-colors hidden sm:inline"
              >
                Voir le site
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-xs text-[#5C6478] hover:text-[#9BA3B5] transition-colors"
              >
                <LogoutIcon size={14} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
        {view === 'list' && (
          <>
            <div className="mb-8">
              <NewsletterCounter onViewList={() => setView('newsletter')} />
            </div>
            <ArticleList
              articles={articles}
              onNew={handleNew}
              onEdit={handleEdit}
              onDelete={onDeleteArticle}
              onClick={onArticleClick}
            />
          </>
        )}
        {view === 'write' && (
          <ArticleEditor
            article={editingArticle}
            onSave={handleSave}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'newsletter' && (
          <NewsletterManager />
        )}
        {view === 'profile' && (
          <ProfileEditor author={author} onUpdate={onUpdateAuthor} />
        )}
      </main>
    </div>
  );
}

/* ============================================
   ARTICLE LIST
   ============================================ */
function ArticleList({
  articles,
  onNew,
  onEdit,
  onDelete,
  onClick,
}: {
  articles: Article[];
  onNew: () => void;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
  onClick: (a: Article) => void;
}) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const categoryLabel = {
    recherche: 'Recherche',
    decouverte: 'Découverte',
    article: 'Article',
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-3">
            Espace auteur
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-[#E8E6E3]">
            Vos notes
          </h1>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 text-sm text-[#E8E6E3] hover:text-white transition-colors border border-white/[0.08] hover:border-white/[0.15] px-5 py-2.5 rounded-sm btn-press"
        >
          <PlusIcon size={14} />
          Nouvelle note
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-xl text-[#9BA3B5] font-light">
            Aucune note publiée.
          </p>
          <button
            onClick={onNew}
            className="mt-6 text-sm text-[#4A6FA5] hover:text-[#5A82BE] transition-colors"
          >
            Écrire la première →
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group py-6 border-t border-white/[0.06] flex items-start justify-between gap-4"
            >
              <button
                onClick={() => onClick(article)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#4A6FA5] text-xs tracking-wide">
                    {categoryLabel[article.category]}
                  </span>
                  <span className="text-[#3D4557]">—</span>
                  <time className="text-[#5C6478] text-xs">
                    {formatDate(article.date)}
                  </time>
                </div>
                <h3 className="font-display text-lg md:text-xl text-[#E8E6E3] group-hover:text-white transition-colors leading-snug">
                  {article.title}
                </h3>
              </button>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(article)}
                  className="flex items-center gap-1.5 text-xs text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors px-3 py-1.5 rounded-sm hover:bg-white/[0.04]"
                  title="Modifier"
                >
                  <EditIcon size={14} />
                  <span className="hidden sm:inline">Modifier</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Supprimer cette note ?')) onDelete(article.id);
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#9BA3B5] hover:text-[#C45C5C] transition-colors px-3 py-1.5 rounded-sm hover:bg-white/[0.04]"
                  title="Supprimer"
                >
                  <TrashIcon size={14} />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   ARTICLE EDITOR
   ============================================ */
function ArticleEditor({
  article,
  onSave,
  onCancel,
}: {
  article: Article | null;
  onSave: (a: Article) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(article?.title || '');
  const [category, setCategory] = useState<'recherche' | 'decouverte' | 'article'>(article?.category || 'article');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [tags, setTags] = useState(article?.tags.join(', ') || '');
  const [images, setImages] = useState<string[]>(article?.images || []);
  const [error, setError] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image trop volumineuse (max 5 Mo).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const text = linkText || linkUrl;
    const md = `[${text}](${linkUrl})`;
    setContent(prev => prev + (prev ? '\n' : '') + md);
    setShowLinkDialog(false);
    setLinkText('');
    setLinkUrl('');
  };

  const insertImageLink = () => {
    if (!imageUrl) return;
    const md = `![${imageAlt || 'image'}](${imageUrl})`;
    setContent(prev => prev + (prev ? '\n' : '') + md);
    setShowImageDialog(false);
    setImageUrl('');
    setImageAlt('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Le titre est requis.'); return; }
    if (!content.trim()) { setError('Le contenu est requis.'); return; }

    const newArticle: Article = {
      id: article?.id || Date.now().toString(),
      title: title.trim(),
      category,
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 180) + '...',
      date: article?.date || new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      images,
    };
    onSave(newArticle);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-light text-[#E8E6E3]">
          {article ? 'Modifier la note' : 'Nouvelle note'}
        </h1>
        <button
          onClick={onCancel}
          className="text-xs text-[#5C6478] hover:text-[#9BA3B5] transition-colors"
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-3">
            Titre
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Donnez un titre à cette note"
            className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors font-display text-2xl font-light"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-3">
            Catégorie
          </label>
          <div className="flex gap-2">
            {(['recherche', 'decouverte', 'article'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs tracking-wide rounded-sm border transition-all ${
                  category === cat
                    ? 'bg-[#4A6FA5] text-[#E8E6E3] border-[#4A6FA5]'
                    : 'bg-transparent text-[#9BA3B5] border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                {cat === 'recherche' ? 'Recherche' : cat === 'decouverte' ? 'Découverte' : 'Article'}
              </button>
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-3">
            Résumé (optionnel)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Une phrase pour donner envie de lire..."
            rows={2}
            className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-3">
            Contenu
          </label>
          {/* Toolbar */}
          <div className="flex items-center gap-1 mb-3 pb-3 border-b border-white/[0.04]">
            <button
              type="button"
              onClick={() => setShowLinkDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9BA3B5] hover:text-[#E8E6E3] hover:bg-white/[0.04] rounded-sm transition-all"
              title="Insérer un lien"
            >
              <LinkIcon size={14} />
              <span className="hidden sm:inline">Lien</span>
            </button>
            <button
              type="button"
              onClick={() => setShowImageDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9BA3B5] hover:text-[#E8E6E3] hover:bg-white/[0.04] rounded-sm transition-all"
              title="Image via URL"
            >
              <ImageIcon size={14} />
              <span className="hidden sm:inline">URL</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9BA3B5] hover:text-[#E8E6E3] hover:bg-white/[0.04] rounded-sm transition-all"
              title="Téléverser une image"
            >
              <UploadIcon size={14} />
              <span className="hidden sm:inline">Téléverser</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Écrivez votre note ici.\n\nSyntaxe :\n[Texte du lien](https://exemple.com)\n![Description](url-image)`}
            rows={18}
            className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm leading-relaxed font-mono resize-y"
          />
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div>
            <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-3">
              Images jointes
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-sm" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-[#0B0F19]/80 rounded-sm flex items-center justify-center text-[#9BA3B5] hover:text-[#C45C5C] opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-3">
            Mots-clés (séparés par des virgules)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="science, technologie, réflexion..."
            className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm"
          />
        </div>

        {error && <p className="text-[#C45C5C] text-sm">{error}</p>}

        {/* Submit */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/[0.06]">
          <button
            type="submit"
            className="px-8 py-3 bg-[#4A6FA5] text-[#E8E6E3] text-sm tracking-wide hover:bg-[#5A82BE] transition-colors btn-press rounded-sm"
          >
            {article ? 'Mettre à jour' : 'Publier'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-[#5C6478] hover:text-[#9BA3B5] transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md bg-[#131825] border border-white/[0.08] rounded-sm p-8">
            <h3 className="font-display text-xl text-[#E8E6E3] mb-6">Insérer un lien</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Texte affiché</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Cliquez ici"
                  className="w-full px-0 py-2 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-0 py-2 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={insertLink}
                className="px-5 py-2 bg-[#4A6FA5] text-[#E8E6E3] text-sm rounded-sm hover:bg-[#5A82BE] transition-colors"
              >
                Insérer
              </button>
              <button
                type="button"
                onClick={() => { setShowLinkDialog(false); setLinkText(''); setLinkUrl(''); }}
                className="px-5 py-2 text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md bg-[#131825] border border-white/[0.08] rounded-sm p-8">
            <h3 className="font-display text-xl text-[#E8E6E3] mb-6">Insérer une image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Description</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description de l'image"
                  className="w-full px-0 py-2 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">URL de l'image</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-0 py-2 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={insertImageLink}
                className="px-5 py-2 bg-[#4A6FA5] text-[#E8E6E3] text-sm rounded-sm hover:bg-[#5A82BE] transition-colors"
              >
                Insérer
              </button>
              <button
                type="button"
                onClick={() => { setShowImageDialog(false); setImageUrl(''); setImageAlt(''); }}
                className="px-5 py-2 text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================
   PROFILE EDITOR
   ============================================ */
function ProfileEditor({
  author,
  onUpdate,
}: {
  author: Author;
  onUpdate: (a: Author) => void;
}) {
  const [name, setName] = useState(author.name);
  const [bio, setBio] = useState(author.bio || '');
  const [location, setLocation] = useState(author.location || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    setMessage('');
    const updated = { ...author, name, bio, location };
    localStorage.setItem('blog_author', JSON.stringify(updated));
    localStorage.setItem('blog_session', JSON.stringify(updated));
    onUpdate(updated);
    setMessage('Modifications enregistrées.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangePassword = () => {
    setError('');
    setMessage('');
    if (currentPassword !== author.password) {
      setError('Mot de passe actuel incorrect.');
      return;
    }
    if (newPassword.length < 4) {
      setError('Le nouveau mot de passe doit contenir au moins 4 caractères.');
      return;
    }
    const updated = { ...author, password: newPassword };
    localStorage.setItem('blog_author', JSON.stringify(updated));
    localStorage.setItem('blog_session', JSON.stringify(updated));
    onUpdate(updated);
    setCurrentPassword('');
    setNewPassword('');
    setMessage('Mot de passe modifié.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-12">
        <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-3">
          Profil
        </p>
        <h1 className="font-display text-3xl font-light text-[#E8E6E3]">
          Informations personnelles
        </h1>
      </div>

      <div className="space-y-10">
        {/* Basic info */}
        <section>
          <h2 className="text-xs text-[#5C6478] uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/[0.06]">
            Identité
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Email</label>
              <p className="text-[#9BA3B5] text-sm py-3 border-b border-white/[0.04]">
                {author.email}
              </p>
            </div>
            <div>
              <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Localisation</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ville, pays"
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#4A6FA5] text-[#E8E6E3] text-sm rounded-sm hover:bg-[#5A82BE] transition-colors btn-press"
            >
              Enregistrer
            </button>
          </div>
        </section>

        {/* Password */}
        <section>
          <h2 className="text-xs text-[#5C6478] uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/[0.06]">
            Sécurité
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5C6478] uppercase tracking-wide mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="px-6 py-2.5 bg-transparent border border-white/[0.08] text-[#E8E6E3] text-sm rounded-sm hover:border-white/[0.15] transition-colors btn-press"
            >
              Changer le mot de passe
            </button>
          </div>
        </section>

        {message && (
          <p className="flex items-center gap-2 text-[#5C9B6E] text-sm">
            <CheckIcon size={14} />
            {message}
          </p>
        )}
        {error && (
          <p className="flex items-center gap-2 text-[#C45C5C] text-sm">
            <AlertIcon size={14} />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
