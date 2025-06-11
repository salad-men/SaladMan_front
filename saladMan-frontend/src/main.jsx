import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import User from './User.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <User />
    <App />
  </BrowserRouter>,
)
