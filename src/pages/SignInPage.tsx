import { useState, type FormEvent } from "react";
import { authClient } from "../lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Identifiants incorrects.");
      }

      // En cas de succès, oauthProviderClient reprend
      // automatiquement le parcours OAuth.
      // Pas besoin de redirection manuelle.
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-container">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-logo">C</div>
          <h1>Citizen</h1>
          <p>Votre identité numérique, en toute sécurité.</p>
        </div>

        <div className="form-heading">
          <h2>Bienvenue</h2>
          <p>Connectez-vous à votre compte citoyen.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="security-note">
          <span>🔒</span>
          Connexion sécurisée par Citizen
        </p>
      </section>
    </main>
  );
}
