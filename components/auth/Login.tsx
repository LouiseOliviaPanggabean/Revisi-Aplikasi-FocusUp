
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User } from '../../types';
import { EyeIcon, EyeOffIcon } from '../icons/SidebarIcons';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  successMessage?: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, successMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [users] = useLocalStorage<User[]>('focusup-users', []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-danger text-sm text-center font-semibold">{error}</p>}
      {successMessage && <p className="text-success text-sm text-center font-semibold">{successMessage}</p>}
      <div>
        <label htmlFor="email-login" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Email
        </label>
        <input
          type="email"
          id="email-login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-light dark:bg-dark-bg border-2 border-gray-400 dark:border-gray-500 text-dark dark:text-dark-text rounded-md p-2 focus:ring-primary focus:border-primary"
          placeholder="Masukkan email anda"
        />
      </div>
      <div>
        <label htmlFor="password-login" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="password-login"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-light dark:bg-dark-bg border-2 border-gray-400 dark:border-gray-500 text-dark dark:text-dark-text rounded-md p-2 pr-10 focus:ring-primary focus:border-primary"
            placeholder="Masukkan password anda"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted dark:text-dark-muted"
            aria-label={isPasswordVisible ? "Sembunyikan password" : "Tampilkan password"}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
      <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-300 shadow-md">
        Masuk
      </button>
    </form>
  );
};

export default Login;
