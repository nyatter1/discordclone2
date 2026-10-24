import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { MainScreen } from './components/MainScreen';

export const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'main'>('login');
  const [currentUser, setCurrentUser] = useState<string>('');

  const handleLoginSuccess = (identifier: string) => {
    setCurrentUser(identifier.trim() || 'User');
    setView('main');
  };

  const handleSignupSuccess = (username: string) => {
    setCurrentUser(username.trim() || 'User');
    setView('main');
  };

  const handleLogout = () => {
    setCurrentUser('');
    setView('login');
  };

  if (view === 'main') {
    return <MainScreen username={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-page-container">
      {view === 'login' ? (
        <LoginForm
          onToggleToRegister={() => setView('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <SignupForm
          onToggleToLogin={() => setView('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
};

export default App;
