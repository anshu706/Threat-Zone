import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './content-architecture.css'
import './typography.css'
import './website-layout.css'
import './landing.css'
import './design/industrial-tokens.css'
import './design/industrial-components.css'
import './dreamhouse.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
