import React, { forwardRef } from 'react';
import cx from 'classnames';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className={className}>
        <textarea
          ref={ref}
          className={cx(
            'shadow-sm block w-full sm:text-sm rounded-md',
            'focus:ring-blue-500 focus:border-blue-500',
            {
              'border-gray-300': !error,
              'border-red-300': error
            }
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;