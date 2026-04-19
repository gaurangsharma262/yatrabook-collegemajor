import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 shadow-lg transform hover:-translate-y-0.5 transition-all duration-300',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${variants[variant]} ${sizes[size]} inline-flex items-center justify-center gap-2 ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="text-lg">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
