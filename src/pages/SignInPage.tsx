import { useState, type FormEvent } from 'react'
import { signIn } from '../auth-client'

type SignInPageProps = {
  onNavigate: (path: string) => void
}

function SignInPage({ onNavigate }: SignInPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signIn({ email, password })
      onNavigate('/consent')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'La connexion a échoué. Veuillez réessayer.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-top" aria-hidden="true" />
      <div className="auth-decoration auth-decoration-bottom" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="sign-in-title">
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

        <div className="auth-heading">
          <span className="eyebrow">RAVI DE VOUS REVOIR</span>
          <h1 id="sign-in-title">Connectez-vous</h1>
          <p>Accédez à votre espace en toute simplicité.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
            required
            type="email"
            value={email}
          />

          <div className="password-label">
            <label htmlFor="password">Mot de passe</label>
            <a href="mailto:support@example.com">Mot de passe oublié ?</a>
          </div>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Votre mot de passe"
            required
            type="password"
            value={password}
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="signup-prompt">
          Pas encore de compte ? <a href="mailto:support@example.com">Contactez-nous</a>
        </p>

        <div className="secure-note">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7" />
          </svg>
          Vos données sont protégées et chiffrées
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

export default SignInPage
