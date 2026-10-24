import React, { useState } from 'react';

interface SignupFormProps {
  onToggleToLogin: () => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const currentYear = 2024;
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

export const SignupForm: React.FC<SignupFormProps> = ({ onToggleToLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h3 className="auth-title">Create an account</h3>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Email
            <span className="required-star">*</span>
          </label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Username
            <span className="required-star">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </div>

        <div className="form-group">
          <label className="form-label">
            Date of Birth
            <span className="required-star">*</span>
          </label>
          <div className="dob-container">
            <select
              className="dob-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value=""></option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              className="dob-select"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value=""></option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="dob-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value=""></option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Continue
        </button>

        <div className="auth-footer">
          <button
            type="button"
            className="toggle-button"
            style={{ marginLeft: 0 }}
            onClick={onToggleToLogin}
          >
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
};
