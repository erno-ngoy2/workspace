import { useState, useRef } from 'react';
import { Article, Author } from '../types';
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
    
    const subscribers = getSubscribers();
    if (subscribers.length > 0) {
      const articleUrl = `${window.location.origin}/#/article/${article.id}`;
      const result = await sendNewArticleNotification(article.title, article.excerpt, articleUrl);
      alert(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(11,15,25,0.95)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <button
                onClick={onBackToPublic}
                style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#E8E6E3', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {author.name}
              </button>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button
                  onClick={() => setView('list')}
                  style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: view === 'list' ? '#E8E6E3' : '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Notes
                </button>
                <button
                  onClick={handleNew}
                  style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: view === 'write' ? '#E8E6E3' : '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Écrire
                </button>
                <button
                  onClick={() => setView('newsletter')}
                  style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: view === 'newsletter' ? '#E8E6E3' : '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Newsletter
                </button>
                <button
                  onClick={() => setView('profile')}
                  style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: view === 'profile' ? '#E8E6E3' : '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Profil
                </button>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={onBackToPublic}
                style={{ fontSize: '12px', color: '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Voir le site
              </button>
              <button
                onClick={onLogout}
                style={{ fontSize: '12px', color: '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px 64px' }}>
        {view === 'list' && (
          <>
            <div style={{ marginBottom: '32px' }}>
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
        {view === 'newsletter' && <NewsletterManager />}
        {view === 'profile' && (
          <ProfileEditor author={author} onUpdate={onUpdateAuthor} />
        )}
      </main>
    </div>
  );
}

function ArticleList({ articles, onNew, onEdit, onDelete, onClick }: {
  articles: Article[];
  onNew: () => void;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
  onClick: (a: Article) => void;
}) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const categoryLabel = { recherche: 'Recherche', decouverte: 'Découverte', article: 'Article' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '48px' }}>
        <div>
          <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Espace auteur
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 300, color: '#E8E6E3' }}>
            Vos notes
          </h1>
        </div>
        <button
          onClick={onNew}
          style={{ fontSize: '14px', color: '#E8E6E3', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px', borderRadius: '2px', background: 'none', cursor: 'pointer' }}
        >
          Nouvelle note
        </button>
      </div>

      {articles.length === 0 ? (
        <div style={{ padding: '96px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#9BA3B5', fontWeight: 300 }}>
            Aucune note publiée.
          </p>
          <button
            onClick={onNew}
            style={{ marginTop: '24px', fontSize: '14px', color: '#4A6FA5', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Écrire la première →
          </button>
        </div>
      ) : (
        <div>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => onClick(article)}
                style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#4A6FA5', fontSize: '12px', letterSpacing: '0.05em' }}>
                    {categoryLabel[article.category]}
                  </span>
                  <span style={{ color: '#3D4557' }}>—</span>
                  <time style={{ color: '#5C6478', fontSize: '12px' }}>
                    {formatDate(article.date)}
                  </time>
                </div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#E8E6E3', lineHeight: 1.3 }}>
                  {article.title}
                </h3>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onEdit(article)}
                  style={{ fontSize: '12px', color: '#9BA3B5', padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Modifier
                </button>
                <button
                  onClick={() => { if (confirm('Supprimer cette note ?')) onDelete(article.id); }}
                  style={{ fontSize: '12px', color: '#9BA3B5', padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleEditor({ article, onSave, onCancel }: {
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
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 300, color: '#E8E6E3' }}>
          {article ? 'Modifier la note' : 'Nouvelle note'}
        </h1>
        <button
          onClick={onCancel}
          style={{ fontSize: '12px', color: '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Titre
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Donnez un titre à cette note"
            style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#E8E6E3', fontSize: '24px', fontFamily: 'Fraunces, serif', fontWeight: 300, outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Catégorie
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['recherche', 'decouverte', 'article'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  borderRadius: '2px',
                  border: category === cat ? '1px solid #4A6FA5' : '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: category === cat ? '#4A6FA5' : 'transparent',
                  color: category === cat ? '#E8E6E3' : '#9BA3B5',
                  cursor: 'pointer'
                }}
              >
                {cat === 'recherche' ? 'Recherche' : cat === 'decouverte' ? 'Découverte' : 'Article'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Résumé (optionnel)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Une phrase pour donner envie de lire..."
            rows={2}
            style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#E8E6E3', fontSize: '14px', resize: 'none', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Contenu
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '12px', color: '#9BA3B5', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Uploader une image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Écrivez votre note ici.\n\nSyntaxe :\n[Texte du lien](https://exemple.com)\n![Description](url-image)`}
            rows={18}
            style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#E8E6E3', fontSize: '14px', lineHeight: 1.7, fontFamily: 'monospace', resize: 'vertical', outline: 'none' }}
          />
        </div>

        {images.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Images jointes
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ position: 'absolute', top: '4px', right: '4px', width: '24px', height: '24px', backgroundColor: 'rgba(11,15,25,0.8)', borderRadius: '2px', border: 'none', color: '#9BA3B5', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Mots-clés (séparés par des virgules)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="science, technologie, réflexion..."
            style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#E8E6E3', fontSize: '14px', outline: 'none' }}
          />
        </div>

        {error && <p style={{ color: '#C45C5C', fontSize: '14px', marginBottom: '20px' }}>{error}</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            type="submit"
            style={{ padding: '12px 32px', backgroundColor: '#4A6FA5', color: '#E8E6E3', fontSize: '14px', letterSpacing: '0.05em', border: 'none', borderRadius: '2px', cursor: 'pointer' }}
          >
            {article ? 'Mettre à jour' : 'Publier'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ fontSize: '14px', color: '#5C6478', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileEditor({ author, onUpdate }: { author: Author; onUpdate: (a: Author) => void }) {
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

  const inputStyle = { width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#E8E6E3', fontSize: '14px', outline: 'none' };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Profil
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 300, color: '#E8E6E3' }}>
          Informations personnelles
        </h1>
      </div>

      <div>
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '12px', color: '#5C6478', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            Identité
          </h2>
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Nom</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
              <p style={{ color: '#9BA3B5', fontSize: '14px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{author.email}</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Localisation</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ville, pays" style={inputStyle} />
            </div>
            <button
              onClick={handleSave}
              style={{ padding: '10px 24px', backgroundColor: '#4A6FA5', color: '#E8E6E3', fontSize: '14px', border: 'none', borderRadius: '2px', cursor: 'pointer' }}
            >
              Enregistrer
            </button>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '12px', color: '#5C6478', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            Sécurité
          </h2>
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Mot de passe actuel</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
            </div>
            <button
              onClick={handleChangePassword}
              style={{ padding: '10px 24px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#E8E6E3', fontSize: '14px', borderRadius: '2px', cursor: 'pointer' }}
            >
              Changer le mot de passe
            </button>
          </div>
        </section>

        {message && <p style={{ color: '#5C9B6E', fontSize: '14px', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: '#C45C5C', fontSize: '14px', marginTop: '20px' }}>{error}</p>}
      </div>
    </div>
  );
}
