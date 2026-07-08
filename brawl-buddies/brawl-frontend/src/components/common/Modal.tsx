import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

/** Overlay modal bertema order board dapur. */
export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#140814]/78 px-3 backdrop-blur-sm" onClick={onClose}>
      <div
        className="chaos-card relative min-w-[min(340px,94vw)] max-w-[94vw] p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rounded-b-xl border-4 border-[#2c1621] bg-[#ffcf5a]" />
        {title && (
          <h2 className="font-impact-game mb-5 mt-2 text-center text-3xl uppercase leading-none text-[#2c1621] [text-shadow:2px_2px_0_#ffcf5a] sm:text-4xl">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
