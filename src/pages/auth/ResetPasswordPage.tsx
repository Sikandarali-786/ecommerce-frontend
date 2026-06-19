import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { resetPassword } from '../../api/auth.api';
import logoImg from '../../assets/images/logo.jpeg';
import Button from '../../components/Button';

const ResetPasswordPage = () => {
  const { token }    = useParams<{ token: string }>();
  const navigate     = useNavigate();

  const [password,     setPassword]     = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [showPwd,      setShowPwd]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-red-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header strip */}
        <div className="bg-[#8B0000] px-8 py-6 flex items-center gap-4">
          <img src={logoImg} alt="Logo" className="h-12 w-12 object-contain rounded-xl bg-white/10 p-1" />
          <div>
            <p className="text-white font-bold text-base leading-tight">Imtiaz Bikerz Studio</p>
            <p className="text-red-200 text-xs">Set a new password</p>
          </div>
        </div>

        <div className="px-8 py-8">
          {!success ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Set new password</h1>
                <p className="text-slate-500 text-sm">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* New password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <FiLock size={16} />
                    </span>
                    <input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50
                        hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40
                        focus:border-[#8B0000] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700"
                    >
                      {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirm" className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <FiLock size={16} />
                    </span>
                    <input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50
                        hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40
                        focus:border-[#8B0000] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block flex-shrink-0" />
                    {error}
                  </p>
                )}

                <Button type="submit" variant="brand" size="lg" fullWidth loading={isLoading}>
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            /* ── Success state ─────────────────────────────────────────── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Password reset!</h2>
              <p className="text-slate-500 text-sm mb-4">
                Your password has been updated successfully.
                Redirecting you to sign in…
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#8B0000] font-semibold text-sm hover:underline"
              >
                Go to Sign In now
              </Link>
            </div>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#8B0000] transition-colors"
              >
                <FiArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
