import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiShield, FiTruck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { registerUser } from '../../api';
import { setToken, setUser } from '../../utils/auth';
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema';
import logoImg from '../../assets/images/logo.png';
import FormField from '../../components/FormField';
import Button from '../../components/Button';

const perks = [
  { icon: <FiTruck size={16} />, text: 'Fast delivery across Pakistan' },
  { icon: <FiShield size={16} />, text: '100% genuine products guaranteed' },
  { icon: <FiStar size={16} />, text: 'Exclusive deals for members' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword: _, ...registerData } = data;
      const response = await registerUser(registerData);
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-red-50 px-4 py-10">

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* ── Left panel: brand ─────────────────────────────────────────── */}
        <div className="relative hidden md:flex md:w-[42%] flex-col justify-between bg-linear-to-r from-[#10354a]  to-[#cf531f] p-10 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -right-10 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <img
                src={logoImg}
                alt="Afzal Bikerz Studio"
                className="h-16 w-16 object-contain rounded-xl bg-white/10 p-1"
              />
              <div>
                <p className="text-white font-bold text-base leading-tight">Afzal Bikerz</p>
                <p className="text-red-200 text-xs">Studio</p>
              </div>
            </div>

            <h2 className="text-white text-2xl font-extrabold leading-snug mb-3">
              Join Pakistan's #1<br />Motorcycle Parts Store
            </h2>
            <p className="text-red-200 text-sm leading-relaxed">
              Create your free account and start shopping premium motorcycle parts today.
            </p>
          </div>

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

          <p className="relative z-10 text-red-300 text-xs">
            © 2026 Afzal Bikerz Studio · Attock, Pakistan
          </p>
        </div>

        {/* ── Right panel: form ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
            <span className="font-bold text-[#8B0000] text-lg">Afzal Bikerz Studio</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#8B0000] font-semibold hover:underline transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <FormField
              id="name"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              icon={<FiUser size={16} />}
              registration={register('name')}
              error={errors.name?.message}
            />

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
            <FormField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              autoComplete="new-password"
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

            {/* Confirm Password */}
            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              icon={<FiLock size={16} />}
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
            />

            {/* Terms note */}
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              By creating an account you agree to our{' '}
              <span className="text-[#8B0000] cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-[#8B0000] cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              variant="brand"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Create Account
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">Have an account?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Login link */}
            <Link
              to="/login"
              className="flex items-center justify-center w-full py-3 px-6 rounded-xl text-sm font-semibold text-[#8B0000]
                border-2 border-[#8B0000]/30 hover:border-[#8B0000] hover:bg-red-50 transition-all"
            >
              Sign In Instead
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
