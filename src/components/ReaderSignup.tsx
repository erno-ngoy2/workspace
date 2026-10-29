import { useState } from 'react';
import { addSubscriber } from '../services/newsletter';

export default function ReaderSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Veuillez entrer votre email');
      return;
    }

    if (!email.includes('@')) {
      setStatus('error');
      setMessage('Email invalide');
      return;
    }

    const success = addSubscriber(email);
    
    if (success) {
      setStatus('success');
      setMessage('Inscription réussie ! Vous recevrez les nouveaux articles par email.');
      setEmail('');
    } else {
      setStatus('error');
      setMessage('Cet email est déjà inscrit à la newsletter');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <div style={{ backgroundColor: '#131825', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px', padding: '40px' }}>
      <div style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#E8E6E3' }}>
            Newsletter
          </h3>
        </div>
        
        <p style={{ color: '#9BA3B5', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Recevez les nouveaux articles directement dans votre boîte mail. 
          Pas de spam, uniquement les publications.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            disabled={status === 'success'}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#0B0F19',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#E8E6E3',
              fontSize: '14px',
              borderRadius: '2px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={status === 'success'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4A6FA5',
              color: '#E8E6E3',
              fontSize: '14px',
              letterSpacing: '0.05em',
              border: 'none',
              borderRadius: '2px',
              cursor: status === 'success' ? 'not-allowed' : 'pointer',
              opacity: status === 'success' ? 0.5 : 1,
              transition: 'background 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (status !== 'success') e.currentTarget.style.backgroundColor = '#5A82BE';
            }}
            onMouseLeave={(e) => {
              if (status !== 'success') e.currentTarget.style.backgroundColor = '#4A6FA5';
            }}
          >
            S'inscrire
          </button>
        </form>

        {status === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#5C9B6E', fontSize: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {message}
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#C45C5C', fontSize: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
