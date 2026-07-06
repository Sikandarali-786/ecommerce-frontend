import { forwardRef } from 'react';

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

// ── Variant styles ────────────────────────────────────────────────────────────
const variantClasses = {
  /** Blue primary — used across products, cart, admin, checkout */
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 focus:ring-blue-500 shadow-sm',

  /** Dark red brand — login/register submit, navbar mobile */
  brand:
    'bg-[#8B0000] text-white hover:bg-red-900 disabled:opacity-60 ' +
    'shadow-lg shadow-red-900/20 hover:shadow-xl hover:shadow-red-900/30 ' +
    'hover:-translate-y-0.5 active:translate-y-0 focus:ring-[#8B0000]',

  /** Dark red outline — secondary auth action, navbar */
  brandOutline:
    'bg-transparent text-[#8B0000] border-2 border-[#8B0000]/30 ' +
    'hover:border-[#8B0000] hover:bg-red-50 focus:ring-[#8B0000]',

  /** Red solid — destructive confirm (delete, cancel order) */
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 focus:ring-red-500 shadow-sm',

  /** Red ghost text — clear cart / clear wishlist */
  dangerGhost:
    'bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 ' +
    'disabled:opacity-50 focus:ring-red-400',

  /** Gray outline — modal cancel, secondary action */
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ' +
    'disabled:opacity-50 focus:ring-gray-400 shadow-sm',

  /** Ghost — subtle nav / back / link-style */
  ghost:
    'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 ' +
    'disabled:opacity-50 focus:ring-gray-400',

  /** Dashed upload trigger */
  upload:
    'bg-transparent text-gray-500 border-2 border-dashed border-gray-300 ' +
    'hover:border-blue-400 hover:text-blue-500 focus:ring-blue-400 w-full justify-center',

  /** Filter tabs (active controlled externally via `active` prop) */
  tab:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',

  /** Active tab state */
  tabActive:
    'bg-blue-600 text-white focus:ring-blue-500',

  /** Brand gradient — teal-to-orange */
  gradient:
    'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white ' +
    'hover:opacity-90 disabled:opacity-60 ' +
    'shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ' +
    'focus:ring-[#cf531f]',
} as const;

// ── Size styles ───────────────────────────────────────────────────────────────
const sizeClasses = {
  /** Tiny — image remove overlays, badges */
  xs: 'px-2 py-1 text-xs rounded-md gap-1',
  /** Small — table action icons, admin inline */
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  /** Default — most buttons */
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  /** Larger CTA — checkout, product detail */
  lg: 'px-6 py-3 text-sm rounded-lg gap-2',
  /** Hero / full-width form submit */
  xl: 'px-8 py-3.5 text-base rounded-xl gap-2',
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize    = keyof typeof sizeClasses;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  fullWidth?: boolean;
  /** Pass icon node — renders before children */
  leftIcon?:  React.ReactNode;
  /** Pass icon node — renders after children */
  rightIcon?: React.ReactNode;
  /** For `tab` variant: marks active state */
  active?:    boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      active    = false,
      disabled,
      children,
      className = '',
      type      = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    // Tab variant swaps class when active
    const resolvedVariant =
      variant === 'tab' && active ? 'tabActive' : variant;

    const base = [
      'inline-flex items-center justify-center font-semibold cursor-pointer',
      'transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed',
      variantClasses[resolvedVariant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={base}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
