import { useEffect, useState } from 'react'
import ConsentPage from './pages/ConsentPage'
import SignInPage from './pages/SignInPage'
import './App.css'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  if (pathname === '/consent') {
    return <ConsentPage onNavigate={navigate} />
  }

  return <SignInPage onNavigate={navigate} />
}

export default App
