import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { logConsoleBanner } from './utils/logConsoleBanner'

// For curious cats
logConsoleBanner();

// Disable scroll restoration so that the page always starts at the top when navigating to a new route
if ("scrollRestoration" in history)
{
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
