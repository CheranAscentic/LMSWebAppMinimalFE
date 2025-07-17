import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import apiService, { type LoginData } from '../services/ApiServices';
import { Button } from '../components/ui/button';

interface LoginFormProps {
  onLoginSuccess: (userData: LoginData) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, execute } = useApi<LoginData>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await execute(() => apiService.login(email, password));
      
      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', response.data.user.type);
      localStorage.setItem('userId', response.data.user.id.toString());
      
      // Call the success callback to update app state
      onLoginSuccess(response.data);
      
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Lib-X</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <Button
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </form>
      
    </div>
  );
}