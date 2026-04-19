import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg">
            {icon}
          </span>
        )}
        <motion.input
          ref={ref}
          type={type}
          className={`input-dark ${icon ? 'pl-12' : ''} ${
            error ? 'border-danger/50 focus:border-danger focus:ring-danger/20' : ''
          } ${focused ? 'border-primary-500/50' : ''} ${className}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={{
            borderColor: error
              ? 'rgba(255, 0, 110, 0.5)'
              : focused
                ? 'rgba(102, 126, 234, 0.5)'
                : 'rgba(255, 255, 255, 0.1)',
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-danger"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
