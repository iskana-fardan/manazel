import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ColorModeProvider from './theme/ColorModeProvider.tsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <RouterProvider router={router} />
    </ColorModeProvider>
  </StrictMode>,
)
