import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

/** Tombol global bertema arcade dapur. */
export default function Button({ variant = 'primary', className = '', children, style, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      className={`chaos-button ${isPrimary ? '' : 'secondary'} ${className}`}
      style={{
        minWidth: 200,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
