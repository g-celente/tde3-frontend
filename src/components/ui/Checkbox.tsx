import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

// Tipos
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            type="checkbox"
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={props.id} className="font-medium text-gray-700">
            {label}
          </label>
          {helperText && !error && (
            <p className="text-gray-500">{helperText}</p>
          )}
          {error && (
            <p className="text-red-600">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;