// src/main.jsx
// Application entry point with Wagmi Web3 and Learning progression providers

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Web3Provider } from './context/WagmiProvider.jsx';
import { LearningProvider } from './context/LearningContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3Provider>
      <LearningProvider>
        <App />
      </LearningProvider>
    </Web3Provider>
  </React.StrictMode>
);
