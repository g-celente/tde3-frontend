import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

// Tipos
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'modern';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    fullWidth = false, 
    className = '',
    leftIcon,
    rightIcon,
    type = 'text',
    variant = 'modern',
    inputSize = 'md',
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const variants = {
      default: 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 focus:border-white/40 focus:ring-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
      modern: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-13 px-5 text-base'
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;
    const hasError = !!error;

    // Classes base do input
    const baseInputClasses = 'w-full rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Classes completas
    const inputClasses = `
      ${baseInputClasses}
      ${variants[variant]}
      ${sizes[inputSize]}
      ${leftIcon ? 'pl-11' : ''}
      ${(rightIcon || type === 'password') ? 'pr-11' : ''}
      ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <motion.div 
        className={fullWidth ? 'w-full' : ''}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <motion.label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}
          
          {/* Input */}
          <motion.input
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...(props as any)}
          />
          
          {/* Right Icon or Password Toggle */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {type === 'password' ? (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            ) : rightIcon ? (
              <div className="text-gray-400 dark:text-gray-500">
                {rightIcon}
              </div>
            ) : null}
          </div>

          {/* Glassmorphism shine effect */}
          {variant === 'glass' && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 pointer-events-none"
              animate={isFocused ? { 
                opacity: [0, 1, 0],
                x: ['-100%', '100%']
              } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          )}
        </div>

        {helperText && !error && (
          <motion.p 
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle size={16} className="mr-1 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;