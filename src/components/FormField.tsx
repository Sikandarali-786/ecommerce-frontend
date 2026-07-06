import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  registration: UseFormRegisterReturn;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
}

const FormField = ({
  id,
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  registration,
  rightSlot,
  autoComplete,
}: FormFieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-slate-600 tracking-wide mb-1.5"
    >
      {label}
    </label>

    <div className="relative">
      {/* Left icon */}
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <span className={error ? 'text-red-400' : 'text-slate-400'}>{icon}</span>
      </span>

      <input
        {...registration}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full pl-10 ${rightSlot ? 'pr-11' : 'pr-4'} py-3 text-sm rounded-xl border
          bg-slate-50 text-slate-900 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-[#8B0000]/40 focus:border-[#8B0000] focus:bg-white
          transition-all ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
      />

      {/* Right slot (e.g. show/hide password toggle) */}
      {rightSlot && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
          {rightSlot}
        </div>
      )}
    </div>

    {/* Error message */}
    {error && (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-red-500 inline-block shrink-0" />
        {error}
      </p>
    )}
  </div>
);

export default FormField;
