import {App} from '#components/App';
import {SuperError} from '#includes/error';
import React from 'react';
import ReactDOM from 'react-dom/client';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) throw new SuperError('main.tsx', '!root');

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
  );
});