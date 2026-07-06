import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DressCode } from './components/DressCode'
import { EventDetails } from './components/EventDetails'

import '@fontsource-variable/playfair-display/wght';
import '@fontsource-variable/montserrat/wght';

import './index.css'

const path = window.location.pathname;
const Root = path === '/dress-code'
  ? DressCode
  : path === '/event-details'
    ? EventDetails
    : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root/>
  </StrictMode>,
)
