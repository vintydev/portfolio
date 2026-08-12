import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'

// Refreshing (or reopening) the site should always start at the top rather than wherever the
// browser last had it scrolled to - relying on the browser's scroll restoration is also what let
// layout-measurement effects elsewhere (e.g. the hero's hand-drawn arrow) run against a scroll
// position they weren't expecting
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
