import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { forgotPassword } from '../../api/auth.api';
import logoImg from '../../assets/images/logo.jpeg';
import Button from '../../components/Button';

const ForgotPasswordPage = () => {
  const [email,     setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken,  setDevToken]  = useState('');    // dev-only
  const [error,     setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSubmitted(true);
      // Dev/demo: show the token so it can be tested without email
      if (res.devResetToken) setDevToken(res.devResetToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-red-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header strip */}
        <div className="bg-[#8B0000] px-8 py-6 flex items-center gap-4">
          <img src={logoImg} alt="Logo" className="h-12 w-12 object-contain rounded-xl bg-white/10 p-1" />
          <div>
            <p className="text-white font-bold text-base leading-tight">Afzal Bikerz Studio</p>
            <p className="text-red-200 text-xs">Reset your password</p>
          </div>
        </div>

        <div className="px-8 py-8">
          {!submitted ? (
            <>
              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Forgot password?</h1>
                <p className="text-slate-500 text-sm">
                  Enter your account email and we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <FiMail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50 text-slate-900 placeholder-slate-400
                        focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40 focus:border-[#8B0000] focus:bg-white transition-all
                        ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
                    />
                  </div>
                  {error && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                      {error}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="brand" size="lg" fullWidth loading={isLoading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            /* ── Success state ─────────────────────────────────────────── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm mb-6">
                If <span className="font-semibold text-slate-700">{email}</span> is registered,
                a reset link has been sent. Check your inbox and spam folder.
              </p>

              {/* Dev / demo token — remove in production */}
              {devToken && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                    🛠 Dev mode — reset token
                  </p>
                  <p className="text-xs text-amber-600 mb-2">
                    Use this token to test the reset flow (no email service needed):
                  </p>
                  <Link
                    to={`/reset-password/${devToken}`}
                    className="block text-xs font-mono text-[#8B0000] break-all hover:underline"
                  >
                    /reset-password/{devToken}
                  </Link>
                </div>
              )}

              <Button
                variant="brand"
                size="md"
                fullWidth
                onClick={() => { setSubmitted(false); setEmail(''); setDevToken(''); }}
              >
                Try a different email
              </Button>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#8B0000] transition-colors"
            >
              <FiArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
