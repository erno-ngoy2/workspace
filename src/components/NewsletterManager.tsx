import { useState, useEffect } from 'react';
import { Subscriber, getSubscribers, removeSubscriber, getEmailHistory, clearEmailHistory } from '../services/newsletter';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);

  useEffect(() => {
    setSubscribers(getSubscribers());
    setEmailHistory(getEmailHistory());
  }, []);

  const handleRemoveSubscriber = (email: string) => {
    if (confirm(`Désabonner ${email} ?`)) {
      removeSubscriber(email);
      setSubscribers(getSubscribers());
    }
  };

  const handleClearHistory = () => {
    if (confirm('Effacer tout l\'historique des emails envoyés ?')) {
      clearEmailHistory();
      setEmailHistory([]);
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
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: '#5C6478', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Newsletter
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 300, color: '#E8E6E3' }}>
          Gestion des abonnés
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#131825', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px', padding: '24px' }}>
          <p style={{ color: '#5C6478', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Abonnés</p>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', color: '#E8E6E3' }}>{subscribers.length}</p>
        </div>
        <div style={{ backgroundColor: '#131825', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px', padding: '24px' }}>
          <p style={{ color: '#5C6478', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Emails envoyés</p>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', color: '#E8E6E3' }}>{emailHistory.length}</p>
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '12px', color: '#5C6478', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          Liste des abonnés
        </h2>

        {subscribers.length === 0 ? (
          <p style={{ color: '#9BA3B5', fontSize: '14px', padding: '32px 0', textAlign: 'center' }}>
            Aucun abonné pour le moment.
          </p>
        ) : (
          <div>
            {subscribers.map((sub) => (
              <div
                key={sub.email}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div>
                  <p style={{ color: '#E8E6E3', fontSize: '14px' }}>{sub.email}</p>
                  <p style={{ color: '#5C6478', fontSize: '12px', marginTop: '4px' }}>
                    Inscrit le {formatDate(sub.subscribedAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSubscriber(sub.email)}
                  style={{ fontSize: '12px', color: '#9BA3B5', padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Désabonner
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: '12px', color: '#5C6478', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Historique des envois
          </h2>
          {emailHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{ fontSize: '12px', color: '#9BA3B5', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Effacer
            </button>
          )}
        </div>

        {emailHistory.length === 0 ? (
          <p style={{ color: '#9BA3B5', fontSize: '14px', padding: '32px 0', textAlign: 'center' }}>
            Aucun email envoyé pour le moment.
          </p>
        ) : (
          <div>
            {[...emailHistory].reverse().map((email, index) => (
              <div
                key={index}
                style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                  <p style={{ color: '#E8E6E3', fontSize: '14px', fontWeight: 500 }}>
                    {email.articleTitle}
                  </p>
                  <span style={{ color: '#5C6478', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {formatDate(email.sentAt)}
                  </span>
                </div>
                <p style={{ color: '#9BA3B5', fontSize: '12px', marginBottom: '8px' }}>
                  {email.articleExcerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                  <span style={{ color: '#5C9B6E' }}>
                    ✓ {email.recipientCount} envoyé(s)
                  </span>
                  {email.errorCount > 0 && (
                    <span style={{ color: '#C45C5C' }}>
                      ⚠ {email.errorCount} erreur(s)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#131825', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px' }}>
        <h3 style={{ fontSize: '14px', color: '#E8E6E3', marginBottom: '12px' }}>Configuration EmailJS</h3>
        <p style={{ color: '#9BA3B5', fontSize: '12px', lineHeight: 1.6, marginBottom: '12px' }}>
          Pour activer l'envoi réel d'emails, configurez EmailJS dans le fichier{' '}
          <code style={{ color: '#4A6FA5' }}>src/services/newsletter.ts</code>.
        </p>
        <p style={{ color: '#5C6478', fontSize: '12px' }}>
          En mode simulation, les emails sont enregistrés localement mais pas envoyés.
        </p>
      </div>
    </div>
  );
}
