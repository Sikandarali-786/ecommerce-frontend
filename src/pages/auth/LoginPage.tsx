import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiTruck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loginUser } from '../../api';
import {
  clearLoginLock,
  getLoginLock,
  setLoginLock,
  setToken,
  setUser,
} from '../../utils/auth';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';
import logoImg from '../../assets/images/logo.png';
import FormField from '../../components/FormField';
import Button from '../../components/Button';

const perks = [
  { icon: <FiTruck size={16} />, text: 'Fast delivery across Pakistan' },
  { icon: <FiShield size={16} />, text: '100% genuine products guaranteed' },
  { icon: <FiStar size={16} />, text: 'Exclusive deals for members' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email')?.trim().toLowerCase() ?? '';
  const loginLock = emailValue ? getLoginLock(emailValue) : null;
  const loginState = location.state as { from?: string } | null;
  const isEmailLocked = !!loginLock && loginLock.lockedUntil > now;
  const lockSecondsLeft = isEmailLocked
    ? Math.max(1, Math.ceil((loginLock.lockedUntil - now) / 1000))
    : 0;
  const lockCountdown = isEmailLocked
    ? `${Math.floor(lockSecondsLeft / 3600)
      .toString()
      .padStart(2, '0')}:${Math.floor((lockSecondsLeft % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${(lockSecondsLeft % 60).toString().padStart(2, '0')}`
    : '';

  useEffect(() => {
    if (!isEmailLocked) return undefined;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isEmailLocked, loginLock?.lockedUntil]);

  useEffect(() => {
    if (!emailValue) return;

    const lock = getLoginLock(emailValue);
    if (lock) {
      setNow(Date.now());
    }
  }, [emailValue]);

  const onSubmit = async (data: LoginFormData) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existingLock = getLoginLock(normalizedEmail);

    if (existingLock) {
      const minutesLeft = Math.max(
        1,
        Math.ceil((existingLock.lockedUntil - Date.now()) / (60 * 1000)),
      );
      toast.error(`You are blocked for 1 hour. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser(data);
      if (response.success) {
        clearLoginLock(normalizedEmail);
        setToken(response.token);
        setUser(response.user);
        toast.success('Welcome back!');
        const defaultRedirect = response.user.role === 'admin' ? '/admin' : '/';
        navigate(loginState?.from || defaultRedirect);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      const status = error.response?.status;
      const isTemporaryLock =
        status === 403 &&
        /locked|too many failed login attempts/i.test(message);

      if (isTemporaryLock) {
        const lockMs = 60 * 60 * 1000;
        setLoginLock(normalizedEmail, Date.now() + lockMs, 'account');
        setNow(Date.now());
        toast.error('You are blocked for 1 hour due to too many failed login attempts.');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-red-50 px-4 py-10">

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* ── Left panel: brand ─────────────────────────────────────────── */}
        <div className="relative hidden md:flex md:w-[42%] flex-col justify-between bg-gradient-to-r from-[#24437d] to-[#cf531f] p-10 overflow-hidden">          {/* Background pattern circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -right-10 w-40 h-40 rounded-full bg-white/5" />

          {/* Top: logo + brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <img
                src={logoImg}
                alt="Afzal Bikerz Store"
                className="h-16 w-16 object-contain rounded-xl bg-white/10 p-1"
              />
              <div>
                <p className="text-white font-bold text-base leading-tight">Afzal Bikerz</p>
                <p className="text-red-200 text-xs">Store</p>
              </div>
            </div>

            <h2 className="text-white text-2xl font-extrabold leading-snug mb-3">
              Pakistan's #1<br />Motorcycle Parts Store
            </h2>
            <p className="text-red-200 text-sm leading-relaxed">
              Sign in to access exclusive deals, track your orders, and manage your account.
            </p>
          </div>

          {/* Middle: perks */}
          <div className="relative z-10 space-y-4 my-8">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
                  {p.icon}
                </div>
                <span className="text-red-100 text-sm">{p.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom: tagline */}
          <p className="relative z-10 text-red-300 text-xs">
            © 2026 Afzal Bikerz Store · Multan, Pakistan
          </p>
        </div>

        {/* ── Right panel: form ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
            <span className="font-bold text-[#8B0000] text-lg">Afzal Bikerz Store</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#8B0000] font-semibold hover:underline transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your Email"
              autoComplete="email"
              icon={<FiMail size={16} />}
              registration={register('email')}
              error={errors.email?.message}
            />

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</span>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#8B0000] hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormField
                id="password"
                label=""
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                icon={<FiLock size={16} />}
                registration={register('password')}
                error={errors.password?.message}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="brand"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isEmailLocked}
            >
              {isEmailLocked ? 'Blocked' : 'Sign In'}
            </Button>

            {isEmailLocked && (
              <p className="text-sm text-red-600 font-medium -mt-2 text-center">
                Your account is blocked. Try again in {lockCountdown}.
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">New here?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Register link */}
            <Link
              to="/register"
              className="flex items-center justify-center w-full py-3 px-6 rounded-xl text-sm font-semibold text-[#8B0000]
                border-2 border-[#8B0000]/30 hover:border-[#8B0000] hover:bg-red-50 transition-all"
            >
              Create a New Account
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
