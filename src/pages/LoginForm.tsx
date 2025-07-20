import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import apiService, { type LoginData } from '../services/ApiServices';
import { Button } from '../components/ui/button';
import type { User } from '@/models/User';
import { Input } from '@/components/ui/input';
import { Mail, Lock, EyeOff, Eye, Shield } from 'lucide-react';

interface LoginFormProps {
  setAppUser: (user: User) => void;
  appUser: User;
}

export function LoginForm({ setAppUser, appUser }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, execute } = useApi<LoginData>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await execute(() => apiService.login(email, password));
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const user : User = {
        isloggedIn: true,
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        type: response.data.user.type as "Member" | "StaffMinor" | "StaffManagement" | "none",
        token: response.data.token,
        firstName: response.data.user.firstName || "",
        lastName: response.data.user.lastName || "",
        address: response.data.user.address || ""
      }

      setAppUser(user);
      
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  console.log('Rendering LoginForm with appUser:', appUser);

  if (appUser.isloggedIn) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Signed In</h3>
          <p className="text-green-600">You have been successfully signed in.</p>
        </div>
      </div>
    );
  } 

  return (
  <>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Lib-X</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Mail className="absolute left-3 top-1/2 translate-y-0.5 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Lock className="absolute left-3 top-1/2 translate-y-0.5 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 translate-y-0.5 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </form>
      </div>
  </>
);
}