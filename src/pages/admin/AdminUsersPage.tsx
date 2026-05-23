import { useMemo, useState } from 'react';
import { FiUsers, FiShield, FiUserX, FiUserCheck, FiTrash2 } from 'react-icons/fi';
import {
  useAllUsers,
  useToggleUserStatus,
  useUpdateUserRole,
  useDeleteUser,
} from '../../hooks/useAdmin';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getUser } from '../../utils/auth';
import type { User } from '../../api/admin.api';

type StatusFilter = 'all' | 'active' | 'blocked';
type RoleFilter = 'all' | 'user' | 'admin';

const AdminUsersPage = () => {
  const currentUser = getUser();
  const { data, isLoading } = useAllUsers();
  const toggleStatus = useToggleUserStatus();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (statusFilter === 'active') {
      result = result.filter((u) => !u.isBlocked);
    } else if (statusFilter === 'blocked') {
      result = result.filter((u) => u.isBlocked);
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [users, search, statusFilter, roleFilter]);

  const isSelf = (userId: string) => currentUser?._id === userId;

  const handleToggleBlock = (user: User) => {
    if (isSelf(user._id)) return;
    const action = user.isBlocked ? 'unblock' : 'block';
    if (
      window.confirm(
        `Are you sure you want to ${action} ${user.name} (${user.email})?`
      )
    ) {
      toggleStatus.mutate(user._id);
    }
  };

  const handleRoleChange = (user: User, role: 'user' | 'admin') => {
    if (isSelf(user._id) || user.role === role) return;
    if (
      window.confirm(`Change ${user.name}'s role to "${role}"?`)
    ) {
      updateRole.mutate({ id: user._id, role });
    }
  };

  const handleDelete = (user: User) => {
    if (isSelf(user._id)) return;
    if (
      window.confirm(
        `Delete user "${user.name}" permanently? This cannot be undone.`
      )
    ) {
      deleteUser.mutate(user._id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">
            Block, unblock, change roles, and manage accounts
          </p>
        </div>
        <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm self-start">
          <strong>{data?.totalUsers ?? 0}</strong> total users
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none md:w-40"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none md:w-36"
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <EmptyState
            icon={<FiUsers className="text-gray-400" />}
            title="No users found"
            description={
              users.length === 0
                ? 'Registered users will appear here.'
                : 'Try adjusting your search or filters.'
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const self = isSelf(user._id);
                  const isPending =
                    (toggleStatus.isPending &&
                      toggleStatus.variables === user._id) ||
                    (updateRole.isPending &&
                      updateRole.variables?.id === user._id) ||
                    (deleteUser.isPending && deleteUser.variables === user._id);

                  return (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 ${user.isBlocked ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                          {self && (
                            <span className="ml-2 text-xs text-blue-600 font-normal">
                              (You)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        {self ? (
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700 capitalize">
                            <FiShield size={14} />
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user,
                                e.target.value as 'user' | 'admin'
                              )
                            }
                            disabled={isPending}
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 capitalize focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!self && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleBlock(user)}
                                disabled={isPending}
                                title={
                                  user.isBlocked ? 'Unblock user' : 'Block user'
                                }
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                                  user.isBlocked
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                }`}
                              >
                                {user.isBlocked ? (
                                  <>
                                    <FiUserCheck size={14} />
                                    Unblock
                                  </>
                                ) : (
                                  <>
                                    <FiUserX size={14} />
                                    Block
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(user)}
                                disabled={isPending}
                                title="Delete user"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
