import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Tipos
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  onClick,
  ...props
}, ref) => {
  // Variantes com design moderno e glassmorphism
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border-0',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 dark:text-white hover:bg-white/20 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl border-0',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl border-0',
    outline: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl border-0'
  };

  // Tamanhos
  const sizes = {
    xs: 'px-3 py-1.5 text-xs font-medium',
    sm: 'px-4 py-2 text-sm font-medium',
    md: 'px-6 py-2.5 text-sm font-medium',
    lg: 'px-8 py-3 text-base font-medium',
    xl: 'px-10 py-4 text-lg font-medium'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  // Classes base do botão
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  // Classes completas
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${isLoading || disabled ? 'cursor-wait' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={buttonClasses}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...(props as any)}
    >
      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl"
        >
          <Loader2 className={`animate-spin ${iconSizes[size]}`} />
        </motion.div>
      )}
      
      {/* Content */}
      <motion.div
        className={`flex items-center space-x-2 ${isLoading ? 'opacity-0' : ''}`}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {leftIcon && (
          <span className={iconSizes[size]}>
            {leftIcon}
          </span>
        )}
        {children && <span>{children}</span>}
        {rightIcon && (
          <span className={iconSizes[size]}>
            {rightIcon}
          </span>
        )}
      </motion.div>

      {/* Glassmorphism shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
        whileHover={{ 
          opacity: 1,
          x: ['-100%', '100%']
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;