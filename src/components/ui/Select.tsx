import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

// Tipos
interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, fullWidth = false, className = '', ...props }, ref) => {
    // Classes base do select
    const baseSelectClasses = 'block px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    
    // Classes completas
    const selectClasses = `
      ${baseSelectClasses}
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select ref={ref} className={selectClasses} {...props}>
          <option value="">Selecione uma opção</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;