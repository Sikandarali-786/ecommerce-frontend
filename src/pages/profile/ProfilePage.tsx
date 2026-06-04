import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiMail, FiLock, FiSave, FiEye, FiEyeOff, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { updateUserProfile, changeUserPassword } from '../../api/user.api';
import { getUser, setUser } from '../../utils/auth';
import { useOrders } from '../../hooks/useOrders';
import { useWishlist } from '../../hooks/useWishlist';

/* ── Schemas ─────────────────────────────────────────────────────────────── */
const profileSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData  = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

/* ── Component ───────────────────────────────────────────────────────────── */
const ProfilePage = () => {
  const user = getUser();
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const { data: ordersData }   = useOrders();
  const { data: wishlistData } = useWishlist();

  const totalOrders    = ordersData?.orders?.length ?? 0;
  const wishlistCount  = wishlistData?.wishlist?.products?.length ?? 0;
  const deliveredCount = ordersData?.orders?.filter(o => o.orderStatus === 'Delivered').length ?? 0;

  /* ── Profile form ─────────────────────────────────────────────────────── */
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const profileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      setUser(data.user);         // keep localStorage in sync
      toast.success('Profile updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });

  /* ── Password form ────────────────────────────────────────────────────── */
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changeUserPassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('Password changed successfully');
      resetPassword();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => profileMutation.mutate(data);

  const onPasswordSubmit = ({ currentPassword, newPassword }: PasswordFormData) =>
    passwordMutation.mutate({ currentPassword, newPassword });

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your profile and security settings</p>
        </div>

        {/* ── Profile card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              user?.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>

          {/* Quick stats */}
          <div className="sm:ml-auto grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-500">Orders</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-900">{deliveredCount}</p>
              <p className="text-xs text-gray-500">Delivered</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
              <p className="text-xs text-gray-500">Wishlist</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Update profile form ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <FiUser className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Profile Information</h3>
                <p className="text-xs text-gray-500">Update your name and email</p>
              </div>
            </div>

            <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...regProfile('name')}
                    type="text"
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      profileErrors.name ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                </div>
                {profileErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{profileErrors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...regProfile('email')}
                    type="email"
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      profileErrors.email ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {profileErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{profileErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiSave size={15} />
                {profileMutation.isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* ── Change password form ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                <FiLock className="text-orange-600" size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Change Password</h3>
                <p className="text-xs text-gray-500">Keep your account secure</p>
              </div>
            </div>

            <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...regPassword('currentPassword')}
                    type={showCurrent ? 'text' : 'password'}
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.currentPassword ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...regPassword('newPassword')}
                    type={showNew ? 'text' : 'password'}
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.newPassword ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm new password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...regPassword('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiLock size={15} />
                {passwordMutation.isPending ? 'Changing…' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Quick links ──────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
              <FiShoppingBag className="text-blue-600" size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">My Orders</p>
              <p className="text-sm text-gray-500">{totalOrders} order{totalOrders !== 1 ? 's' : ''} placed</p>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-red-200 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
              <FiHeart className="text-red-500" size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">My Wishlist</p>
              <p className="text-sm text-gray-500">{wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
