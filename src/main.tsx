import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import '@fontsource-variable/playfair-display/wght';
import '@fontsource-variable/montserrat/wght';

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
