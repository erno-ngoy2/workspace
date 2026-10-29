import { useState } from 'react';
import { getSubscribers } from '../services/newsletter';

interface NewsletterCounterProps {
  onViewList: () => void;
}

export default function NewsletterCounter({ onViewList }: NewsletterCounterProps) {
  const [count] = useState(() => getSubscribers().length);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#131825', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px', padding: '12px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span style={{ fontSize: '12px', color: '#5C6478', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Abonnés</span>
      </div>
      <span style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#E8E6E3' }}>{count}</span>
      <button
        onClick={onViewList}
        style={{
          marginLeft: 'auto',
          fontSize: '12px',
          color: '#9BA3B5',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '6px 12px',
          borderRadius: '2px',
          background: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#E8E6E3';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#9BA3B5';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        Voir la liste
      </button>
    </div>
  );
}
