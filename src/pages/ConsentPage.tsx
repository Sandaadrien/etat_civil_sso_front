import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

interface ConsentInfo {
  clientName: string;
  redirectHost: string;
  scopes: string[];
}

const scopeDescriptions: Record<string, string> = {
  openid: "Vérifier votre identité",
  profile: "Consulter les informations de votre profil",
  email: "Consulter votre adresse e-mail",
  offline_access: "Maintenir un accès avec un jeton de renouvellement",
};

export default function ConsentPage() {
  const [info, setInfo] = useState<ConsentInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConsentInfo() {
      try {
        const query = window.location.search;

        const response = await fetch(
          `${import.meta.env.VITE_AUTH_URL}/api/oauth/consent-info${query}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Impossible de vérifier la demande.");
        }

        const data: ConsentInfo = await response.json();
        setInfo(data);
      } catch {
        setError("La demande d'autorisation est invalide ou a expiré.");
      } finally {
        setLoadingInfo(false);
      }
    }

    loadConsentInfo();
  }, []);

  async function handleConsent(accept: boolean) {
    setError("");
    setLoadingAction(true);

    try {
      const { error } = await authClient.oauth2.consent({
        accept,
      });

      if (error) {
        setError(error.message || "Impossible de traiter votre choix.");
      }

      // En cas de succès, Better Auth effectue automatiquement
      // la redirection vers la prochaine étape OAuth.
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoadingAction(false);
    }
  }

  if (loadingInfo) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <p className="loading-text">Vérification de la demande...</p>
        </section>
      </main>
    );
  }

  if (!info) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <h2>Demande non valide</h2>
          <p className="error-message">
            {error || "Impossible de charger les informations."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <section className="auth-card consent-card">
        <div className="brand">
          <div className="brand-logo">C</div>
          <h1>Citizen</h1>
        </div>

        <div className="consent-icon">🔐</div>

        <div className="form-heading">
          <h2>Autorisation d'accès</h2>
          <p>
            Une application souhaite accéder à certaines informations de votre
            compte Citizen.
          </p>
        </div>

        <div className="application-info">
          <span className="info-label">Application demandeuse</span>
          <h3>{info.clientName}</h3>
          <span className="application-host">{info.redirectHost}</span>
        </div>

        <div className="permissions">
          <h3>Cette application souhaite :</h3>

          {info.scopes.map((scope) => (
            <div className="permission-item" key={scope}>
              <span className="permission-check">✓</span>
              <span>{scopeDescriptions[scope] || scope}</span>
            </div>
          ))}
        </div>

        <p className="consent-warning">
          En autorisant cette demande, vous acceptez que l'application accède
          aux informations mentionnées ci-dessus.
        </p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="consent-actions">
          <button
            className="button-secondary"
            onClick={() => handleConsent(false)}
            disabled={loadingAction}
          >
            Refuser
          </button>

          <button onClick={() => handleConsent(true)} disabled={loadingAction}>
            {loadingAction ? "Traitement..." : "Autoriser"}
          </button>
        </div>

        <p className="security-note">
          🔒 Vous gardez le contrôle de vos données.
        </p>
      </section>
    </main>
  );
}
