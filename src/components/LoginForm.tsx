import React, { useState } from 'react';

interface LoginFormProps {
  onToggleToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleToRegister }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h3 className="auth-title">Welcome back!</h3>
        <div className="auth-subtitle">We're so excited to see you again!</div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Email or Phone Number
            <span className="required-star">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Password
            <span className="required-star">*</span>
          </label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="forgot-password-link">
            Forgot your password?
          </button>
        </div>

        <button type="submit" className="submit-button">
          Log In
        </button>

        <div className="auth-footer">
          <span>Need an account?</span>
          <button
            type="button"
            className="toggle-button"
            onClick={onToggleToRegister}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
