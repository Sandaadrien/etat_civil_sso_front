import { useState } from 'react'
import { submitConsent } from '../auth-client'

type ConsentPageProps = {
  onNavigate: (path: string) => void
}

const permissions = [
  {
    icon: 'person',
    title: 'Informations de profil',
    detail: 'Nom et photo de profil',
  },
  {
    icon: 'mail',
    title: 'Adresse e-mail',
    detail: 'Pour vous identifier et vous contacter',
  },
  {
    icon: 'shield',
    title: 'Accès sécurisé',
    detail: 'Maintenir votre session active',
  },
]

function PermissionIcon({ name }: { name: string }) {
  if (name === 'person') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20v-1.5a7 7 0 0 1 14 0V20H5Z" />
      </svg>
    )
  }
  if (name === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m4.5 7 7.5 5.5L19.5 7" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function ConsentPage({ onNavigate }: ConsentPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [decision, setDecision] = useState<'approved' | 'denied' | null>(null)

  const handleConsent = async (approved: boolean) => {
    setError('')
    setIsSubmitting(true)

    try {
      await submitConsent({ approved })
      setDecision(approved ? 'approved' : 'denied')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Votre réponse n’a pas pu être enregistrée. Veuillez réessayer.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page consent-page">
      <div className="auth-decoration auth-decoration-top" aria-hidden="true" />
      <div className="auth-decoration auth-decoration-bottom" aria-hidden="true" />

      <section className="auth-card consent-card" aria-labelledby="consent-title">
        <a className="brand" href="/" onClick={(event) => {
          event.preventDefault()
          onNavigate('/sign-in')
        }}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
              <path d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
          </span>
          <span>nexus<span className="brand-period">.</span></span>
        </a>

        {decision ? (
          <div className="decision-state" aria-live="polite">
            <span className={`decision-icon ${decision}`} aria-hidden="true">
              {decision === 'approved' ? '✓' : '×'}
            </span>
            <span className="eyebrow">DEMANDE TRAITÉE</span>
            <h1 id="consent-title">
              {decision === 'approved' ? 'Accès autorisé' : 'Accès refusé'}
            </h1>
            <p>
              {decision === 'approved'
                ? 'Votre consentement a bien été enregistré. Vous pouvez continuer.'
                : 'Votre choix a été enregistré. Vous pouvez fermer cette page.'}
            </p>
            <button
              className="primary-button"
              onClick={() => onNavigate('/sign-in')}
              type="button"
            >
              Retour à la connexion <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="app-identity">
              <span className="app-avatar" aria-hidden="true">A</span>
              <span className="app-connection" aria-hidden="true">↔</span>
              <span className="brand-mark app-brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
                  <path d="m8.5 12 2.2 2.2 4.8-5" />
                </svg>
              </span>
            </div>

            <div className="auth-heading consent-heading">
              <span className="eyebrow">AUTORISATION D’ACCÈS</span>
              <h1 id="consent-title">Un dernier petit pas</h1>
              <p>
                <strong>Atelier</strong> souhaite accéder à certaines informations
                de votre compte Nexus.
              </p>
            </div>

            <div className="permissions" aria-label="Autorisations demandées">
              {permissions.map((permission) => (
                <div className="permission-row" key={permission.title}>
                  <span className="permission-icon">
                    <PermissionIcon name={permission.icon} />
                  </span>
                  <span className="permission-copy">
                    <strong>{permission.title}</strong>
                    <span>{permission.detail}</span>
                  </span>
                  <svg className="permission-check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m5 10 3.2 3.2L15.5 6" />
                  </svg>
                </div>
              ))}
            </div>

            <p className="consent-disclaimer">
              Vous pourrez modifier ces autorisations à tout moment depuis les
              paramètres de votre compte.
            </p>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="consent-actions">
              <button
                className="primary-button"
                disabled={isSubmitting}
                onClick={() => void handleConsent(true)}
                type="button"
              >
                {isSubmitting ? 'Enregistrement…' : 'Autoriser l’accès'}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
              <button
                className="secondary-button"
                disabled={isSubmitting}
                onClick={() => void handleConsent(false)}
                type="button"
              >
                Refuser
              </button>
            </div>
          </>
        )}

        <div className="secure-note">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7" />
          </svg>
          Connexion sécurisée par Nexus
        </div>
      </section>

      <footer className="page-footer">
        <span>© 2025 Nexus</span>
        <span className="footer-links">
          <a href="mailto:support@example.com">Aide</a>
          <a href="mailto:privacy@example.com">Confidentialité</a>
        </span>
      </footer>
    </main>
  )
}

export default ConsentPage
