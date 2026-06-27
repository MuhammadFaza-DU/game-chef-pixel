import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

/** Overlay modal dengan frame pixel art. */
export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="pixel-panel min-w-[340px] max-w-[90vw] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="font-pixel mb-5 text-center text-xs leading-relaxed text-chaos-yellow drop-shadow">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
