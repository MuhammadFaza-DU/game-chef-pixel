import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

/** Tombol pixel art (Kenney UI Pack). */
export default function Button({ variant = 'primary', className = '', children, style, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      className={`font-pixel relative cursor-pointer border-none bg-transparent px-6 py-3 text-sm tracking-wide transition active:translate-y-0.5 active:brightness-90 ${className}`}
      style={{
        backgroundImage: `url(/ui/${isPrimary ? 'btn-primary' : 'btn-ghost'}.png)`,
        backgroundSize: '100% 100%',
        imageRendering: 'pixelated',
        color: isPrimary ? '#1a1a2e' : '#ffffff',
        minWidth: 200,
        textShadow: isPrimary ? 'none' : '0 1px 3px rgba(0,0,0,0.8)',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
