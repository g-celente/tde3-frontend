import { useState, useRef, forwardRef, useEffect } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import Button from './Button';

// Tipos
type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  onChange: (file: File | null) => void;
  value?: File | null;
  accept?: string;
};

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, helperText, error, fullWidth = false, className = '', value, onChange, accept, ...props }, ref) => {
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (value) {
        setFileName(value.name);
      } else {
        setFileName('');
      }
    }, [value]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onChange(file);
      setFileName(file ? file.name : '');
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleClear = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onChange(null);
      setFileName('');
    };

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            type="file"
            onChange={handleFileChange}
            className="sr-only"
            accept={accept}
            {...props}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleClick}
            className={fullWidth ? 'w-full sm:w-auto' : ''}
          >
            Escolher arquivo
          </Button>
          <div className="flex-1 flex items-center">
            {fileName ? (
              <div className="flex items-center justify-between w-full border rounded-md px-3 py-2 text-sm">
                <span className="truncate">{fileName}</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Limpar</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Nenhum arquivo selecionado</span>
            )}
          </div>
        </div>
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

FileUpload.displayName = 'FileUpload';

export default FileUpload;