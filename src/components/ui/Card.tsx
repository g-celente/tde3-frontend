import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Tipos
interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  footer?: ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const Card = ({ 
  children, 
  title, 
  className = '', 
  footer,
  variant = 'default',
  padding = 'md',
  hover = true
}: CardProps) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
    gradient: 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl',
    elevated: 'bg-white dark:bg-gray-800 shadow-2xl border-0'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const baseClasses = 'rounded-2xl transition-all duration-300 ease-out overflow-hidden';
  
  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { 
        y: -4,
        boxShadow: variant === 'glass' || variant === 'gradient' 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
    >
      {/* Glassmorphism overlay effect */}
      {(variant === 'glass' || variant === 'gradient') && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {title && (
          <motion.div 
            className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </motion.div>
        )}
        
        <motion.div 
          className={!title && !footer ? paddings[padding] : 'px-6 py-4'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {children}
        </motion.div>
        
        {footer && (
          <motion.div 
            className="px-6 py-3 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-600/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {footer}
          </motion.div>
        )}
      </div>
      
      {/* Animated border gradient for glass variant */}
      {variant === 'glass' && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))',
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude'
          }}
        />
      )}
    </motion.div>
  );
};

export default Card;