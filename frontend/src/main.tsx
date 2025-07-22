import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import {store} from './app/store'
import Routes from './routes'
import './index.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <Toaster richColors position="top-right" />
      <Routes />
    </Provider>
  </React.StrictMode>,
)
