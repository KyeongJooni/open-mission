import { inputVariants, textFieldVariants } from '@/components/common/Text/TextFieldVariants';
import { TextFieldProps } from '@/types/text';
import clsx from 'clsx';
import { forwardRef } from 'react';

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      placeholder = 'Text field',
      className = '',
      value,
      onChange,
      onBlur,
      type = 'text',
      error = false,
      errorMessage,
      name,
      variant = 'default',
      backgroundColor = 'transparent',
      textColor = 'gray56',
      fontSize = 'light',
      disabled = false,
      fullWidth = false,
      autoComplete = 'off',
    },
    ref
  ) => {
    return (
      <>
        <div
          className={clsx(
            textFieldVariants({ variant, backgroundColor, disabled, fullWidth }),
            error && 'border-error',
            className
          )}
        >
          <input
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            autoComplete={autoComplete}
            className={inputVariants({ textColor, fontSize })}
          />
        </div>
        {error && errorMessage && <span className="mt-1 text-xs text-error">{errorMessage}</span>}
      </>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
