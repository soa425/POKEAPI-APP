// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import GlobalStyle from './styles/GlobalStyles'; // GlobalStyle 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle /> {/* ✨ DOM 충돌 방지를 위해 루트에 배치 */}
      <App />
    </Provider>
  </React.StrictMode>
);