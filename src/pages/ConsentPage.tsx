import { useMemo, useState } from "react";
import { authClient } from "../lib/auth-client";
// comments
const descriptions: Record<string, string> = {
  openid: "Vérifier votre identité",
  profile: "Consulter les informations de votre profil",
  email: "Consulter votre adresse e-mail",
  offline_access: "Maintenir un accès avec un jeton de renouvellement",
};

export default function ConsentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const scopes = (params.get("scope") || "").split(" ").filter(Boolean);

  async function handleConsent(accept: boolean) {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.oauth2.consent({
        accept,
      });

      if (result.error) {
        setError(result.error.message || "Erreur de consentement.");
      }
    } catch {
      setError("Impossible de traiter votre autorisation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-container">
      <section className="auth-card consent-card">
        <div className="brand">
          <div className="brand-logo">C</div>
          <h1>Citizen</h1>
        </div>

        <h2>Autorisation d'accès</h2>

        <p>
          Une application souhaite accéder aux informations de votre compte
          Citizen.
        </p>

        <h3>Autorisations demandées :</h3>

        {scopes.map((scope) => (
          <div className="permission-item" key={scope}>
            <span>✓</span>
            <span>{descriptions[scope] || scope}</span>
          </div>
        ))}

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="consent-actions">
          <button onClick={() => handleConsent(false)} disabled={loading}>
            Refuser
          </button>

          <button onClick={() => handleConsent(true)} disabled={loading}>
            {loading ? "Traitement..." : "Autoriser"}
          </button>
        </div>
      </section>
    </main>
  );
}
