import { useRef, useState } from 'react';
import { pressKey, releaseKey, isTouchDevice } from '../../game/input/virtualKeys';

interface MobileControlsProps {
  onPause: () => void;
}

const DEADZONE = 14;

/**
 * Overlay kontrol sentuh: joystick analog kiri (gerak 8-arah) + tombol aksi
 * kanan (J ringan / K berat / L special / E masak) dan tombol jeda.
 * Menggerakkan game lewat KeyboardEvent sintetis (lihat virtualKeys.ts),
 * jadi tidak ada logika gameplay yang diduplikasi.
 */
export default function MobileControls({ onPause }: MobileControlsProps) {
  const [show] = useState(isTouchDevice);
  const baseRef = useRef<HTMLDivElement>(null);
  const held = useRef<Set<string>>(new Set());
  const dragging = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  if (!show) return null;

  const setDirection = (dx: number, dy: number) => {
    const next = new Set<string>();
    if (Math.hypot(dx, dy) > DEADZONE) {
      if (dy < -DEADZONE) next.add('w');
      if (dy > DEADZONE) next.add('s');
      if (dx < -DEADZONE) next.add('a');
      if (dx > DEADZONE) next.add('d');
    }
    for (const k of held.current) {
      if (!next.has(k)) {
        releaseKey(k);
        held.current.delete(k);
      }
    }
    for (const k of next) {
      if (!held.current.has(k)) {
        pressKey(k);
        held.current.add(k);
      }
    }
  };

  const onJoyMove = (e: React.PointerEvent) => {
    const base = baseRef.current;
    if (!base) return;
    const r = base.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = r.width / 2;
    const mag = Math.hypot(dx, dy);
    if (mag > max) {
      dx = (dx / mag) * max;
      dy = (dy / mag) * max;
    }
    setKnob({ x: dx, y: dy });
    setDirection(dx, dy);
  };

  const onJoyStart = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onJoyMove(e);
  };

  const onJoyEnd = () => {
    dragging.current = false;
    setKnob({ x: 0, y: 0 });
    for (const k of held.current) releaseKey(k);
    held.current.clear();
  };

  // Tombol aksi: press saat sentuh, release saat lepas (attack pakai JustDown).
  const actionHandlers = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      pressKey(key);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      releaseKey(key);
    },
    onPointerLeave: () => releaseKey(key),
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      {/* Tombol jeda kanan-atas */}
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          onPause();
        }}
        className="pointer-events-auto absolute right-4 top-4 h-12 w-12 rounded-full border-4 border-chaos-ink bg-white/80 text-xl font-bold"
      >
        ⏸
      </button>

      {/* Joystick kiri-bawah */}
      <div
        ref={baseRef}
        onPointerDown={onJoyStart}
        onPointerMove={(e) => dragging.current && onJoyMove(e)}
        onPointerUp={onJoyEnd}
        onPointerCancel={onJoyEnd}
        className="pointer-events-auto absolute bottom-8 left-8 h-36 w-36 touch-none rounded-full border-4 border-chaos-ink/70 bg-black/30"
      >
        <div
          className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full border-4 border-chaos-ink bg-chaos-blue/90"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
      </div>

      {/* Tombol aksi kanan-bawah */}
      <div className="pointer-events-none absolute bottom-8 right-8 grid grid-cols-2 gap-3">
        <ActionButton label="E" sub="masak" color="bg-chaos-yellow" {...actionHandlers('e')} />
        <ActionButton label="L" sub="special" color="bg-chaos-red" {...actionHandlers('l')} />
        <ActionButton label="K" sub="berat" color="bg-chaos-blue" {...actionHandlers('k')} />
        <ActionButton label="J" sub="ringan" color="bg-white/80" {...actionHandlers('j')} />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  sub: string;
  color: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
}

function ActionButton({ label, sub, color, ...handlers }: ActionButtonProps) {
  return (
    <button
      {...handlers}
      className={`pointer-events-auto flex h-16 w-16 touch-none flex-col items-center justify-center rounded-full border-4 border-chaos-ink ${color} font-bold leading-none text-chaos-ink active:scale-90`}
    >
      <span className="text-xl">{label}</span>
      <span className="text-[10px]">{sub}</span>
    </button>
  );
}
