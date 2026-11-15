import { useState } from "react";

const API_URL = "https://api-etatcivil.esera.works";

type ClientResult = {
  success: boolean;
  client: {
    client_id: string;
    client_secret: string | null;
    client_name: string;
    redirect_uris: string[];
    post_logout_redirect_uris?: string[];
    application_type: string;
    token_endpoint_auth_method: string;
  };
  message: string;
};

type LoginResult = {
  redirect: boolean;
  token: string;
  user: {
    name: string;
    email: string;
    emailVerified: boolean;
    id: string;
  };
};

export default function DeveloperRegister() {
  // Authentification administrateur
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Informations application
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [postLogoutRedirectUri, setPostLogoutRedirectUri] = useState("");
  const [type, setType] = useState("web");

  // États
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClientResult | null>(null);
  const [error, setError] = useState("");

  // ==========================================
  // AUTHENTIFICATION + CRÉATION APPLICATION
  // ==========================================

  async function createApplication(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // ÉTAPE 1 : CONNEXION ADMINISTRATEUR

      const loginResponse = await fetch(`${API_URL}/api/auth/sign-in/email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          loginData.message ||
            loginData.error ||
            "Échec de la connexion administrateur.",
        );
      }

      const token = (loginData as LoginResult).token;

      if (!token) {
        throw new Error("Aucun Bearer Token reçu après la connexion.");
      }

      // Nettoyage du mot de passe
      setPassword("");

      // ÉTAPE 2 : CRÉATION DU CLIENT OAUTH

      const response = await fetch(`${API_URL}/oauth/clients`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_name: name.trim(),

          redirect_uris: [redirectUri.trim()],

          post_logout_redirect_uris: [postLogoutRedirectUri.trim()],

          application_type: type,

          token_endpoint_auth_method:
            type === "native" ? "none" : "client_secret_basic",

          scope: "openid profile email",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Impossible de créer l'application.",
        );
      }

      if (!data.client) {
        throw new Error(
          "La réponse du serveur ne contient pas les informations du client.",
        );
      }

      // ÉTAPE 3 : AFFICHAGE DU RÉSULTAT

      setResult(data as ClientResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // COPIER LES IDENTIFIANTS
  // ==========================================

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setError(
        "Impossible de copier. Vérifiez les autorisations du navigateur.",
      );
    }
  }

  return (
    <main className="developer-container">
      <div className="developer-wrapper">
        {/* HEADER */}

        <header className="developer-header">
          <div className="developer-brand">
            <div className="developer-logo">C</div>

            <div>
              <span>CITIZEN</span>
              <p>DEVELOPER PORTAL</p>
            </div>
          </div>

          <div className="developer-badge">
            <span></span>
            Espace développeur
          </div>
        </header>

        {/* INTRODUCTION */}

        <div className="developer-intro">
          <div className="developer-label">CITIZEN DEVELOPERS</div>

          <h1>Enregistrer une application</h1>

          <p>
            Créez votre client OAuth pour intégrer l'authentification Citizen à
            votre application.
          </p>
        </div>

        {/* FORMULAIRE */}

        {!result && (
          <section className="developer-card">
            <div className="developer-card-header">
              <div className="developer-card-icon">+</div>

              <div>
                <h2>Nouvelle application</h2>
                <p>
                  Connectez-vous et renseignez les informations de votre
                  application.
                </p>
              </div>
            </div>

            <form onSubmit={createApplication} className="developer-form">
              {/* AUTHENTIFICATION ADMIN */}

              <div className="authentication-section">
                <div className="authentication-header">
                  <div className="security-icon">🔐</div>

                  <div>
                    <h3>Authentification administrateur</h3>
                    <span>
                      Connectez-vous pour autoriser la création de votre
                      application.
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-email">
                    Adresse e-mail administrateur
                    <span className="required">*</span>
                  </label>

                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />

                  <small>Utilisez votre compte administrateur.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-password">
                    Mot de passe
                    <span className="required">*</span>
                  </label>

                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                  />
                </div>

                <div className="authentication-info">
                  <span>🔒</span>
                  <p>
                    Votre authentification sera vérifiée avant la création de
                    votre client OAuth.
                  </p>
                </div>
              </div>

              {/* INFORMATIONS APPLICATION */}

              <div className="developer-form-divider">
                <span>INFORMATIONS DE L'APPLICATION</span>
              </div>

              {/* NOM */}

              <div className="form-group">
                <label htmlFor="app-name">
                  Nom de l'application
                  <span className="required">*</span>
                </label>

                <input
                  id="app-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Gestion Scolaire"
                />

                <small>
                  Le nom qui sera affiché aux utilisateurs lors de
                  l'autorisation OAuth.
                </small>
              </div>

              {/* REDIRECT URI */}

              <div className="form-group">
                <label htmlFor="redirect-uri">
                  Redirect URI
                  <span className="required">*</span>
                </label>

                <input
                  id="redirect-uri"
                  required
                  type="url"
                  value={redirectUri}
                  onChange={(e) => setRedirectUri(e.target.value)}
                  placeholder={
                    type === "web"
                      ? "https://example.com/callback"
                      : "https://example.com/callback"
                  }
                />

                <small>
                  URL vers laquelle l'utilisateur sera redirigé après son
                  authentification OAuth.
                </small>
              </div>

              {/* POST LOGOUT REDIRECT URI */}

              <div className="form-group">
                <label htmlFor="post-logout-redirect-uri">
                  Post Logout Redirect URI
                  <span className="required">*</span>
                </label>

                <input
                  id="post-logout-redirect-uri"
                  required
                  type="url"
                  value={postLogoutRedirectUri}
                  onChange={(e) => setPostLogoutRedirectUri(e.target.value)}
                  placeholder={
                    type === "web"
                      ? "https://example.com/logout"
                      : "https://example.com/logout"
                  }
                />

                <small>
                  URL vers laquelle l'utilisateur sera redirigé après sa
                  déconnexion de Citizen.
                </small>
              </div>

              {/* TYPE APPLICATION */}

              <div className="form-group">
                <label htmlFor="app-type">Type d'application</label>

                <select
                  id="app-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="web">Web / Next.js / React</option>

                  <option value="native">
                    Native / React Native / Flutter
                  </option>
                </select>
              </div>

              {/* CONFIGURATION SÉCURITÉ */}

              <div className="security-configuration">
                <div className="security-configuration-header">
                  <div className="security-icon">🔒</div>

                  <div>
                    <h3>Configuration de sécurité</h3>
                    <span>Paramètres OAuth appliqués</span>
                  </div>
                </div>

                <p>
                  {type === "web"
                    ? "Client confidentiel : client secret requis côté serveur et PKCE S256."
                    : "Client public : aucun secret, PKCE S256 obligatoire."}
                </p>

                <div className="security-tags">
                  <span>OAuth 2.0</span>
                  <span>PKCE S256</span>
                </div>
              </div>

              {/* ERREUR */}

              {error && (
                <div className="error-message" role="alert">
                  <span>⚠</span>
                  {error}
                </div>
              )}

              {/* BOUTON */}

              <button
                type="submit"
                disabled={loading}
                className="developer-submit"
              >
                {loading
                  ? "Authentification et enregistrement..."
                  : "Créer mon application"}

                {!loading && <span>→</span>}
              </button>
            </form>
          </section>
        )}

        {/* APPLICATION CRÉÉE */}

        {result && (
          <section className="developer-card success-card">
            <div className="success-header">
              <div className="success-icon">✓</div>

              <span className="success-label">APPLICATION CRÉÉE</span>

              <h2>{result.client.client_name}</h2>

              <p>{result.message}</p>
            </div>

            <div className="credentials-section">
              <div className="credentials-heading">
                <h3>Vos identifiants OAuth</h3>

                <p>
                  Conservez ces informations pour configurer votre application.
                </p>
              </div>

              <Credential
                label="Client ID"
                value={result.client.client_id}
                onCopy={copy}
              />

              {result.client.client_secret ? (
                <Credential
                  label="Client Secret"
                  value={result.client.client_secret}
                  onCopy={copy}
                />
              ) : (
                <div className="public-client-note">
                  <strong>Client public</strong>
                  <p>
                    Aucun client secret n'est nécessaire pour ce type
                    d'application.
                  </p>
                </div>
              )}

              <Credential
                label="Redirect URI"
                value={result.client.redirect_uris.join(", ")}
                onCopy={copy}
              />

              <Credential
                label="Post Logout Redirect URI"
                value={
                  result.client.post_logout_redirect_uris?.join(", ") ||
                  postLogoutRedirectUri
                }
                onCopy={copy}
              />

              <div className="developer-warning">
                <span>⚠️</span>

                <div>
                  <strong>Important : sauvegardez vos identifiants</strong>

                  <p>
                    Sauvegardez immédiatement vos identifiants. Le secret ne
                    doit jamais être publié ni partagé.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="developer-secondary-button"
                onClick={() => {
                  setResult(null);
                  setName("");
                  setRedirectUri("");
                  setPostLogoutRedirectUri("");
                  setPassword("");
                  setError("");
                }}
              >
                + Enregistrer une autre application
              </button>
            </div>
          </section>
        )}

        {/* FOOTER */}

        <footer className="developer-footer">
          <p>Citizen Developer Portal</p>
          <span>OAuth 2.0 · Secure Authentication</span>
        </footer>
      </div>
    </main>
  );

  // COMPOSANT IDENTIFIANTS

  function Credential({
    label,
    value,
    onCopy,
  }: {
    label: string;
    value: string;
    onCopy: (value: string) => void;
  }) {
    return (
      <div className="credential-field">
        <label>{label}</label>

        <div className="credential-input-wrapper">
          <input readOnly value={value} />

          <button
            type="button"
            onClick={() => onCopy(value)}
            className="copy-button"
          >
            <span>▢</span>
            Copier
          </button>
        </div>
      </div>
    );
  }
}
