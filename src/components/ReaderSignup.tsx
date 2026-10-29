import { useState } from 'react';
import { addSubscriber } from '../services/newsletter';
import { MailIcon, CheckIcon, AlertIcon } from './Icons';

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

    // Reset après 5 secondes
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <div className="bg-[#131825] border border-white/[0.06] rounded-sm p-8 md:p-10">
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <MailIcon size={20} className="text-[#4A6FA5]" />
          <h3 className="font-display text-xl md:text-2xl text-[#E8E6E3]">
            Newsletter
          </h3>
        </div>
        
        <p className="text-[#9BA3B5] text-sm leading-relaxed mb-6">
          Recevez les nouveaux articles directement dans votre boîte mail. 
          Pas de spam, uniquement les publications.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-4 py-3 bg-[#0B0F19] border border-white/[0.08] text-[#E8E6E3] placeholder-[#3D4557] focus:outline-none focus:border-[#4A6FA5] transition-colors text-sm rounded-sm"
            disabled={status === 'success'}
          />
          <button
            type="submit"
            disabled={status === 'success'}
            className="px-6 py-3 bg-[#4A6FA5] text-[#E8E6E3] text-sm tracking-wide hover:bg-[#5A82BE] transition-colors btn-press rounded-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            S'inscrire
          </button>
        </form>

        {status === 'success' && (
          <div className="flex items-center gap-2 mt-4 text-[#5C9B6E] text-sm">
            <CheckIcon size={16} />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 mt-4 text-[#C45C5C] text-sm">
            <AlertIcon size={16} />
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
