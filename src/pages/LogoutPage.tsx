import { useEffect } from 'react';
import { Shield } from 'lucide-react';

interface LogoutPageProps {
  logout: () => void;
}

export default function LogoutPage({ logout }: LogoutPageProps) {
  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Logged Out</h3>
        <p className="text-green-600">You have been successfully logged out.</p>
      </div>
    </div>
  );
}

