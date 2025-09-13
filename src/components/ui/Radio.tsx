import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

// Tipos
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
          {...props}
        />
        <label htmlFor={props.id} className="ml-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;