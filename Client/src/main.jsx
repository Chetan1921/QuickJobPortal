import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { store } from '@/store/store';
import { ThemeProvider } from '@/providers/ThemeProvider';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-app)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
