import React, { useState } from 'react';
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

  // Check if author account already exists
  React.useEffect(() => {
    const stored = localStorage.getItem('blog_author');
    if (stored) {
      setIsSetup(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // Only ernongoy@gmail.com can publish
    if (email.toLowerCase() !== AUTHOR_EMAIL) {
      setError('Accès réservé. Ce blog est géré par un auteur unique.');
      return;
    }

    if (isSetup) {
      // Login
      const stored = JSON.parse(localStorage.getItem('blog_author') || '{}');
      if (stored.password === password) {
        localStorage.setItem('blog_session', JSON.stringify(stored));
        onLogin(stored);
      } else {
        setError('Mot de passe incorrect.');
      }
    } else {
      // First-time setup
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <button
          onClick={onBack}
          className="text-sm text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors link-underline mb-12"
        >
          ← Retour au blog
        </button>

        <div className="mb-10">
          <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-4">
            Espace auteur
          </p>
          <h1 className="font-display text-3xl font-light text-[#E8E6E3] leading-tight">
            {isSetup ? 'Connexion' : 'Première connexion'}
          </h1>
          <p className="text-[#9BA3B5] text-sm mt-3 leading-relaxed">
            {isSetup
              ? 'Entrez vos identifiants pour accéder à l\'espace de publication.'
              : 'Définissez votre mot de passe pour activer l\'espace de publication.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-2">
              Email
            </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm"
              />          </div>

          <div>
            <label className="block text-xs text-[#5C6478] tracking-wide uppercase mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-0 py-3 bg-transparent border-b border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5C6478] hover:text-[#9BA3B5] transition-colors text-xs"
              >
                {showPassword ? 'masquer' : 'voir'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[#C45C5C] text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-8 py-3.5 bg-[#4A6FA5] text-[#E8E6E3] text-sm tracking-wide hover:bg-[#5A82BE] transition-colors btn-press rounded-sm"
          >
            {isSetup ? 'Se connecter' : 'Activer l\'espace'}
          </button>
        </form>

        <p className="text-[#3D4557] text-xs mt-8 leading-relaxed">
          L'accès à la publication est restreint. Les lecteurs peuvent consulter les notes sans authentification.
        </p>
      </div>
    </div>
  );
}
