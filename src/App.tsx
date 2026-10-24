import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';

export const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <main>
      {view === 'login' ? (
        <LoginForm onToggleToRegister={() => setView('signup')} />
      ) : (
        <SignupForm onToggleToLogin={() => setView('login')} />
      )}
    </main>
  );
};

export default App;
