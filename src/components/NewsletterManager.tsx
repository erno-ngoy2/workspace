import { useState, useEffect } from 'react';
import { Subscriber, getSubscribers, removeSubscriber, getEmailHistory, clearEmailHistory } from '../services/newsletter';
import { TrashIcon, MailIcon, CheckIcon, AlertIcon } from './Icons';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadSubscribers();
    loadHistory();
  }, []);

  const loadSubscribers = () => {
    setSubscribers(getSubscribers());
  };

  const loadHistory = () => {
    setEmailHistory(getEmailHistory());
  };

  const handleRemoveSubscriber = (email: string) => {
    if (confirm(`Désabonner ${email} ?`)) {
      removeSubscriber(email);
      loadSubscribers();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Effacer tout l\'historique des emails envoyés ?')) {
      clearEmailHistory();
      loadHistory();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <p className="text-[#5C6478] text-xs tracking-[0.2em] uppercase mb-3">
          Newsletter
        </p>
        <h1 className="font-display text-3xl font-light text-[#E8E6E3]">
          Gestion des abonnés
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-[#131825] border border-white/[0.06] rounded-sm p-6">
          <p className="text-[#5C6478] text-xs uppercase tracking-wide mb-2">Abonnés</p>
          <p className="font-display text-4xl text-[#E8E6E3]">{subscribers.length}</p>
        </div>
        <div className="bg-[#131825] border border-white/[0.06] rounded-sm p-6">
          <p className="text-[#5C6478] text-xs uppercase tracking-wide mb-2">Emails envoyés</p>
          <p className="font-display text-4xl text-[#E8E6E3]">{emailHistory.length}</p>
        </div>
      </div>

      {/* Subscribers list */}
      <section className="mb-10">
        <h2 className="text-xs text-[#5C6478] uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/[0.06]">
          Liste des abonnés
        </h2>

        {subscribers.length === 0 ? (
          <p className="text-[#9BA3B5] text-sm py-8 text-center">
            Aucun abonné pour le moment.
          </p>
        ) : (
          <div className="space-y-0">
            {subscribers.map((sub) => (
              <div
                key={sub.email}
                className="group flex items-center justify-between py-4 border-t border-white/[0.06]"
              >
                <div>
                  <p className="text-[#E8E6E3] text-sm">{sub.email}</p>
                  <p className="text-[#5C6478] text-xs mt-1">
                    Inscrit le {formatDate(sub.subscribedAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSubscriber(sub.email)}
                  className="flex items-center gap-1.5 text-xs text-[#9BA3B5] hover:text-[#C45C5C] transition-colors px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100"
                  title="Désabonner"
                >
                  <TrashIcon size={14} />
                  <span className="hidden sm:inline">Désabonner</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Email history */}
      <section>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
          <h2 className="text-xs text-[#5C6478] uppercase tracking-[0.2em]">
            Historique des envois
          </h2>
          {emailHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-[#9BA3B5] hover:text-[#C45C5C] transition-colors"
            >
              Effacer
            </button>
          )}
        </div>

        {emailHistory.length === 0 ? (
          <p className="text-[#9BA3B5] text-sm py-8 text-center">
            Aucun email envoyé pour le moment.
          </p>
        ) : (
          <div className="space-y-0">
            {[...emailHistory].reverse().map((email, index) => (
              <div
                key={index}
                className="py-4 border-t border-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-[#E8E6E3] text-sm font-medium">
                    {email.articleTitle}
                  </p>
                  <span className="text-[#5C6478] text-xs whitespace-nowrap">
                    {formatDate(email.sentAt)}
                  </span>
                </div>
                <p className="text-[#9BA3B5] text-xs mb-2 line-clamp-2">
                  {email.articleExcerpt}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-[#5C9B6E]">
                    <CheckIcon size={12} />
                    {email.recipientCount} envoyé(s)
                  </span>
                  {email.errorCount > 0 && (
                    <span className="flex items-center gap-1 text-[#C45C5C]">
                      <AlertIcon size={12} />
                      {email.errorCount} erreur(s)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info EmailJS */}
      <div className="mt-10 p-6 bg-[#131825] border border-white/[0.06] rounded-sm">
        <h3 className="text-sm text-[#E8E6E3] mb-3">Configuration EmailJS</h3>
        <p className="text-[#9BA3B5] text-xs leading-relaxed mb-3">
          Pour activer l'envoi réel d'emails, configurez EmailJS dans le fichier{' '}
          <code className="text-[#4A6FA5]">src/services/newsletter.ts</code>.
        </p>
        <ol className="text-[#9BA3B5] text-xs space-y-2 list-decimal list-inside">
          <li>Créez un compte sur <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-[#4A6FA5] hover:underline">emailjs.com</a></li>
          <li>Connectez votre service email (Gmail, Outlook, etc.)</li>
          <li>Créez un template avec les variables : {'{'}to_email{'}'}, {'{'}article_title{'}'}, {'{'}article_url{'}'}</li>
          <li>Remplacez les clés dans le fichier newsletter.ts</li>
        </ol>
        <p className="text-[#5C6478] text-xs mt-3">
          En mode simulation, les emails sont enregistrés localement mais pas envoyés.
        </p>
      </div>
    </div>
  );
}
