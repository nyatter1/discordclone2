import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { MainScreen } from './components/MainScreen';
import { UserProfile } from './types';

export const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'main'>('login');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'user',
    displayName: 'User',
    avatarUrl: '',
    bannerUrl: '',
    pronouns: '',
    bio: '',
  });

  const handleLoginSuccess = (identifier: string) => {
    const clean = identifier.trim() || 'user';
    setUserProfile((prev) => ({
      ...prev,
      username: clean,
      displayName: clean,
    }));
    setView('main');
  };

  const handleSignupSuccess = (username: string) => {
    const clean = username.trim() || 'user';
    setUserProfile((prev) => ({
      ...prev,
      username: clean,
      displayName: clean,
    }));
    setView('main');
  };

  const handleLogout = () => {
    setView('login');
  };

  if (view === 'main') {
    return (
      <MainScreen
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        onLogout={handleLogout}
      />
    );
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
