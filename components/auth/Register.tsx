
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User } from '../../types';
import { EyeIcon, EyeOffIcon } from '../icons/SidebarIcons';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{name?: string, email?: string, password?: string, general?: string}>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [users, setUsers] = useLocalStorage<User[]>('focusup-users', []);

  const validate = () => {
      const newErrors: {name?: string, email?: string, password?: string} = {};
      if (!name.trim()) newErrors.name = "Nama wajib diisi";
      if (!email.trim()) {
          newErrors.email = "Email wajib diisi";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
          newErrors.email = "Format email tidak valid";
      }
      
      if (!password) {
          newErrors.password = "Password wajib diisi";
      } else if (password.length < 6) {
          newErrors.password = "Password minimal 6 karakter";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    if (users.find(u => u.email === email)) {
      setErrors({general: 'Akun dengan email ini sudah terdaftar.'});
      return;
    }

    const newUser: User = {
      id: new Date().toISOString(),
      name,
      email,
      password,
      joinDate: new Date().toISOString(),
    };

    const newUsers = [...users, newUser];
    localStorage.setItem('focusup-users', JSON.stringify(newUsers));
    setUsers(newUsers);

    onRegisterSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors.general && <p className="text-danger text-sm text-center font-semibold">{errors.general}</p>}
      <div>
        <label htmlFor="name-register" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="name-register"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full bg-light dark:bg-dark-bg border-2 ${errors.name ? 'border-danger' : 'border-gray-400 dark:border-gray-500'} text-dark dark:text-dark-text rounded-md p-2 focus:ring-primary focus:border-primary`}
          placeholder="Masukkan nama anda"
        />
        {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email-register" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Email
        </label>
        <input
          type="email"
          id="email-register"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full bg-light dark:bg-dark-bg border-2 ${errors.email ? 'border-danger' : 'border-gray-400 dark:border-gray-500'} text-dark dark:text-dark-text rounded-md p-2 focus:ring-primary focus:border-primary`}
          placeholder="contoh@email.com"
        />
        {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password-register" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="password-register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-light dark:bg-dark-bg border-2 ${errors.password ? 'border-danger' : 'border-gray-400 dark:border-gray-500'} text-dark dark:text-dark-text rounded-md p-2 pr-10 focus:ring-primary focus:border-primary`}
            placeholder="Minimal 6 karakter"
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
        {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
      </div>
      <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-300 shadow-md">
        Daftar Sekarang
      </button>
    </form>
  );
};

export default Register;
