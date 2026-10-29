import { useState, useEffect } from 'react';
import { getSubscribers } from '../services/newsletter';
import { MailIcon } from './Icons';

interface NewsletterCounterProps {
  onViewList: () => void;
}

export default function NewsletterCounter({ onViewList }: NewsletterCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const subscribers = getSubscribers();
    setCount(subscribers.length);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-[#131825] border border-white/[0.06] rounded-sm px-5 py-3">
      <div className="flex items-center gap-2">
        <MailIcon size={16} className="text-[#4A6FA5]" />
        <span className="text-xs text-[#5C6478] uppercase tracking-wide">Abonnés</span>
      </div>
      <span className="font-display text-2xl text-[#E8E6E3]">{count}</span>
      <button
        onClick={onViewList}
        className="ml-auto text-xs text-[#9BA3B5] hover:text-[#E8E6E3] transition-colors border border-white/[0.08] hover:border-white/[0.15] px-3 py-1.5 rounded-sm"
      >
        Voir la liste
      </button>
    </div>
  );
}
