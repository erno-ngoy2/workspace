import { useState } from 'react';
import { Author, AUTHOR_EMAIL } from '../types';

interface AuthProps {
  onLogin: (author: Author) => void;
  onBack: () => void;
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  useState(() => {
    const stored = localStorage.getItem('blog_author');
    if (stored) {
      setIsSetup(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (email.toLowerCase() !== AUTHOR_EMAIL) {
      setError('Accès réservé à l\'auteur.');
      return;
    }

    if (isSetup) {
      const stored = JSON.parse(localStorage.getItem('blog_author') || '{}');
      if (stored.password === password) {
        localStorage.setItem('blog_session', JSON.stringify(stored));
        onLogin(stored);
      } else {
        setError('Mot de passe incorrect.');
      }
    } else {
      if (password.length < 4) {
        setError('Le mot de passe doit contenir au moins 4 caractères.');
        return;
      }
      const newAuthor: Author = {
        email: AUTHOR_EMAIL,
        password,
        name: 'Erno Ngoy',
        bio: 'Notes, observations et fragments d\'un travail en cours.',
      };
      localStorage.setItem('blog_author', JSON.stringify(newAuthor));
      localStorage.setItem('blog_session', JSON.stringify(newAuthor));
      onLogin(newAuthor);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F19', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button
          onClick={onBack}
          style={{ color: '#9BA3B5', fontSize: '14px', marginBottom: '48px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Retour au blog
        </button>

        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Espace auteur
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 300, color: '#E8E6E3', lineHeight: 1.2 }}>
            {isSetup ? 'Connexion' : 'Première connexion'}
          </h1>
          <p style={{ color: '#9BA3B5', fontSize: '14px', marginTop: '12px', lineHeight: 1.6 }}>
            {isSetup
              ? 'Entrez vos identifiants pour accéder à l\'espace de publication.'
              : 'Définissez votre mot de passe pour activer l\'espace de publication.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{
                width: '100%',
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                color: '#E8E6E3',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#5C6478', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  color: '#E8E6E3',
                  fontSize: '14px',
                  outline: 'none',
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#5C6478',
                  fontSize: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? 'masquer' : 'voir'}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#C45C5C', fontSize: '14px', marginBottom: '20px' }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '32px',
              padding: '14px',
              backgroundColor: '#4A6FA5',
              color: '#E8E6E3',
              fontSize: '14px',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A82BE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A6FA5'}
          >
            {isSetup ? 'Se connecter' : 'Activer l\'espace'}
          </button>
        </form>

        <p style={{ color: '#3D4557', fontSize: '12px', marginTop: '32px', lineHeight: 1.6 }}>
          L'accès à la publication est restreint. Les lecteurs peuvent consulter les notes sans authentification.
        </p>
      </div>
    </div>
  );
}
