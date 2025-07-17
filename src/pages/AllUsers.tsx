import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import apiService, { type User } from '../services/ApiServices';
import { Users, Search, UserPlus, Edit3, Trash2, Shield, User as UserIcon, Mail } from 'lucide-react';

interface AllUsersProps {
  currentUserRole: string;
}

export default function AllUsers({ currentUserRole }: AllUsersProps) {
  const { data: users, loading, error, execute } = useApi<User[]>();
  const { loading: deletingUser, execute: executeDelete } = useApi<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'Member' | 'StaffMinor' | 'StaffManagement'>('all');

  useEffect(() => {
    execute(() => apiService.getAllUsers());
  }, [execute]);

  useEffect(() => {
    if (users) {
      let filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.type.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filter !== 'all') {
        filtered = filtered.filter(user => user.type === filter);
      }

      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, filter]);

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await executeDelete(() => apiService.deleteUser(userId));
        // Refresh the users list
        execute(() => apiService.getAllUsers());
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'StaffManagement':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'StaffMinor':
        return <Shield className="w-5 h-5 text-orange-500" />;
      case 'Member':
        return <UserIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <UserIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'StaffManagement':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'StaffMinor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Member':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserStats = () => {
    if (!users) return { total: 0, members: 0, staffMinor: 0, staffManagement: 0 };
    
    return {
      total: users.length,
      members: users.filter(u => u.type === 'Member').length,
      staffMinor: users.filter(u => u.type === 'StaffMinor').length,
      staffManagement: users.filter(u => u.type === 'StaffManagement').length
    };
  };

  // Check if current user has permission to access this page
  if (currentUserRole !== 'StaffManagement') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
          <p className="text-red-600">You don't have permission to view user management.</p>
          <p className="text-sm text-red-500 mt-2">Only Staff Management can access this section.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => execute(() => apiService.getAllUsers())}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = getUserStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-8 h-8 mr-3 text-blue-500" />
          User Management
        </h2>
        
        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Members</p>
                <p className="text-2xl font-bold text-green-800">{stats.members}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-orange-600 font-medium">Staff Minor</p>
                <p className="text-2xl font-bold text-orange-800">{stats.staffMinor}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-red-600 font-medium">Staff Management</p>
                <p className="text-2xl font-bold text-red-800">{stats.staffManagement}</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add User Button */}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Users ({stats.total})
          </button>
          <button
            onClick={() => setFilter('Member')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Member'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Members ({stats.members})
          </button>
          <button
            onClick={() => setFilter('StaffMinor')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'StaffMinor'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Staff Minor ({stats.staffMinor})
          </button>
          <button
            onClick={() => setFilter('StaffManagement')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'StaffManagement'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Staff Management ({stats.staffManagement})
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 && users?.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
          <p className="text-gray-500 mb-4">There are no users in the system.</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Add First User
          </button>
        </div>
      )}

      {filteredUsers.length === 0 && users && users.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.type)}
                      <span className={`ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(user.type)}`}>
                        {user.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={deletingUser}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>Showing {filteredUsers.length} of {users?.length || 0} users</p>
        </div>
      )}
    </div>
  );
}