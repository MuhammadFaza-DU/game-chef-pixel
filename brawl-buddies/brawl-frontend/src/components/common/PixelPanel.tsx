import type { ReactNode } from 'react';

interface PixelPanelProps {
  children: ReactNode;
  className?: string;
  /** true = transparent center (border only) */
  borderOnly?: boolean;
  padding?: string;
}

/** Panel dengan frame pixel art dari Kenney Fantasy UI Borders. */
export default function PixelPanel({
  children,
  className = '',
  borderOnly = false,
  padding = 'p-3',
}: PixelPanelProps) {
  return (
    <div
      className={`${borderOnly ? 'pixel-panel-border' : 'pixel-panel'} ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
