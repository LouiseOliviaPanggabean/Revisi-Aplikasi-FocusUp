import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { User } from '../../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegistrationComplete = () => {
    setIsRegistering(false);
    setSuccessMessage('Registration successful! You can now sign in.');
  };

  const toggleView = () => {
    setIsRegistering(!isRegistering);
    setSuccessMessage('');
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">FocusUp</h1>
          <p className="text-muted dark:text-dark-muted mt-2">{isRegistering ? 'Create an account to get started' : 'Welcome back! Please sign in.'}</p>
      </div>

      {isRegistering ? (
        <Register onRegisterSuccess={handleRegistrationComplete} />
      ) : (
        <Login onLoginSuccess={onLoginSuccess} successMessage={successMessage} />
      )}

      <div className="mt-6 text-center">
        <button
          onClick={toggleView}
          className="text-sm text-primary hover:underline"
        >
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;