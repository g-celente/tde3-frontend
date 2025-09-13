import type { ChangeEvent } from 'react';
import Radio from './Radio';

// Tipos
interface Option {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  inline?: boolean;
}

const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  inline = false
}: RadioGroupProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
      )}
      <div className={`space-${inline ? 'x' : 'y'}-3 ${inline ? 'flex items-center' : ''}`}>
        {options.map((option) => (
          <div key={option.value} className={inline ? 'mr-4' : ''}>
            <Radio
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              label={option.label}
            />
          </div>
        ))}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;