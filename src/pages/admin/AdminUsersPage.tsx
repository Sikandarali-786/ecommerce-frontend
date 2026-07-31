import { useState } from 'react';
import { FiSearch, FiUsers, FiShield, FiUser, FiLock, FiUnlock, FiTrash2 } from 'react-icons/fi';
import { useAllUsers, useUpdateUserRole, useToggleUserStatus, useDeleteUser } from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Table from '../../components/Table';
import type { TableColumn } from '../../components/Table';
import type { User } from '../../api/admin.api';

const AdminUsersPage = () => {
  const { data, isLoading } = useAllUsers();
  const updateRoleMutation = useUpdateUserRole();
  const toggleStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const users: User[] = data?.users || [];

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  if (isLoading) return <LoadingSpinner />;

  // ─── Table columns ────────────────────────────────────────────────────────
  const columns: TableColumn<User>[] = [
    {
      header: 'User',
      cell: (user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (user) => (
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
        }`}>
          {user.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
          <span className="capitalize">{user.role}</span>
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {user.isBlocked ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Joined',
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateRoleMutation.mutate({ id: user._id, role: user.role === 'admin' ? 'user' : 'admin' })}
            disabled={updateRoleMutation.isPending}
            title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            className={`px-2! ${user.role === 'admin' ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {user.role === 'admin' ? <FiShield size={16} /> : <FiUser size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatusMutation.mutate(user._id)}
            disabled={toggleStatusMutation.isPending}
            title={user.isBlocked ? 'Unblock User' : 'Block User'}
            className={`px-2! ${user.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
          >
            {user.isBlocked ? <FiUnlock size={16} /> : <FiLock size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm(user._id)}
            title="Delete User"
            className="px-2! text-red-600 hover:bg-red-50"
          >
            <FiTrash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(u) => u._id}
          rowClassName={(u) => u.isBlocked ? 'opacity-60' : ''}
          emptyState={
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No users found</p>
            </div>
          }
        />
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this user? This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button variant="secondary" size="md" onClick={() => setDeleteConfirm(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => { deleteUserMutation.mutate(deleteConfirm); setDeleteConfirm(null); }}
                loading={deleteUserMutation.isPending}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
