import { TextField } from '@/components';
import { TextareaProps } from '@/types/text';
import clsx from 'clsx';
import { forwardRef } from 'react';

const Textarea = forwardRef<HTMLInputElement, TextareaProps>(
  (
    {
      title,
      className = '',
      hintText,
      placeholder,
      type = 'text',
      textFieldColor,
      textFieldBackgroundColor,
      textFieldFontSize,
      disabled,
      error,
      name,
      value,
      onChange,
      onBlur,
    },
    ref
  ) => {
    return (
      <div className={clsx('flex w-full max-w-content flex-col items-start gap-1 px-4 py-3', className)}>
        <div className="flex w-full flex-col items-start gap-3">
          {title && <span className="flex-1 text-sm font-light text-gray-56">{title}</span>}
          <TextField
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            textColor={textFieldColor}
            backgroundColor={textFieldBackgroundColor}
            fontSize={textFieldFontSize}
            disabled={disabled}
            error={Boolean(error)}
            fullWidth
          />
        </div>

        {error ? (
          <div className="flex items-center justify-center gap-2.5 self-stretch px-1.5 py-0">
            <span className="flex-1 text-xs font-light text-error">* {error}</span>
          </div>
        ) : (
          hintText && (
            <div className="flex items-center justify-center gap-2.5 self-stretch px-1.5 py-0">
              <span className="flex-1 text-xs font-light text-gray-78">* {hintText}</span>
            </div>
          )
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
