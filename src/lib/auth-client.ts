import { createAuthClient } from "better-auth/react";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL,

  // Les cookies de session Citizen doivent être envoyés
  // au backend pendant les appels d'authentification.
  fetchOptions: {
    credentials: "include",
  },

  plugins: [oauthProviderClient()],
});
