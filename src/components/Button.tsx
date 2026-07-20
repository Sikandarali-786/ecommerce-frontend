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
  /** Gradient primary — used across products, cart, admin, checkout */
  primary:
    'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white ' +
    'hover:opacity-90 disabled:opacity-60 ' +
    'shadow-sm hover:shadow-md focus:ring-[#cf531f]',

  /** Gradient brand — login/register submit, navbar mobile */
  brand:
    'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white ' +
    'hover:opacity-90 disabled:opacity-60 ' +
    'shadow-lg hover:shadow-xl ' +
    'hover:-translate-y-0.5 active:translate-y-0 focus:ring-[#cf531f]',

  /** Gradient outline — secondary auth action, navbar */
  brandOutline:
    'bg-transparent text-[#10354a] border-2 border-[#10354a]/30 ' +
    'hover:border-[#10354a] hover:bg-[#10354a]/5 focus:ring-[#10354a]',

  /** Gradient — destructive confirm (delete, cancel order) */
  danger:
    'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white ' +
    'hover:opacity-90 disabled:opacity-60 shadow-sm focus:ring-[#cf531f]',

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
    'hover:border-[#10354a] hover:text-[#10354a] focus:ring-[#cf531f] w-full justify-center',

  /** Filter tabs (active controlled externally via `active` prop) */
  tab:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',

  /** Active tab state */
  tabActive:
    'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white focus:ring-[#cf531f]',

  /** Brand gradient — teal-to-orange */
  gradient:
    'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white ' +
    'hover:opacity-90 disabled:opacity-60 ' +
    'shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ' +
    'focus:ring-[#cf531f]',

  /** Orange CTA — used for product add-to-cart in updated card */
  orange:
    'bg-[#ff7a1a] text-white hover:bg-[#ff6a00] disabled:opacity-60 focus:ring-[#ff7a1a] shadow-md',
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
