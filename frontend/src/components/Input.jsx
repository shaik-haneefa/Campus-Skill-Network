import React from 'react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  endAdornment,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[#CBD5E1] mb-1.5"
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-xl border transition-all duration-200 text-sm py-2.5 
            ${Icon ? 'pl-10' : 'pl-3.5'} 
            ${endAdornment ? 'pr-11' : 'pr-3.5'} 
            ${
              error
                ? 'border-rose-500/50 text-rose-200 placeholder-rose-400/50 focus:outline-none focus:ring-2 focus:ring-rose-500/25 focus:border-rose-500 bg-rose-950/20'
                : 'border-white/15 text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/25 focus:border-[#3B82F6] bg-[#080B18]/90 hover:border-white/25'
            }
            ${disabled ? 'bg-[#050713]/60 text-slate-500 cursor-not-allowed border-white/5' : ''}
          `}
          {...props}
        />

        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#94A3B8]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
