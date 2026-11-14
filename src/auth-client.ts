const authApiUrl = import.meta.env.VITE_AUTH_API_URL ?? ''

type AuthRequest = {
  email: string
  password: string
}

type ConsentRequest = {
  approved: boolean
}

type ApiError = {
  message?: unknown
}

async function post(path: string, body: AuthRequest | ConsentRequest): Promise<void> {
  const response = await fetch(`${authApiUrl}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const responseText = await response.text()
  let payload: ApiError = {}

  if (responseText) {
    try {
      payload = JSON.parse(responseText) as ApiError
    } catch {
      throw new Error('Le serveur a renvoyé une réponse invalide.')
    }
  }

  if (!response.ok) {
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : `La requête a échoué (${response.status}).`
    throw new Error(message)
  }
}

export function signIn(credentials: AuthRequest): Promise<void> {
  return post('/auth/sign-in', credentials)
}

export function submitConsent(consent: ConsentRequest): Promise<void> {
  return post('/auth/consent', consent)
}
