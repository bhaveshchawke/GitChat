import React from 'react';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Dashboard />
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}

export default App;
