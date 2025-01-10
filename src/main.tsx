import { Provider } from "./components/ui/provider.tsx"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from "./UserContext.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <UserProvider> */}
      <Provider>
        <App />
      </Provider>
    {/* </UserProvider> */}
  </StrictMode>,
)