import { useEffect, useRef, useState } from 'react';
import { isTouchDevice, pressKey, releaseKey } from '../../game/input/virtualKeys';

interface MobileControlsProps {
  onPause: () => void;
}

const DEADZONE = 16;
const MAX_KNOB = 54;

const ACTIONS = [
  { inputKey: 'l', label: 'SP', sub: 'Special', tone: 'action-red', size: 'h-[4.5rem] w-[4.5rem]' },
  { inputKey: 'k', label: 'K', sub: 'Berat', tone: 'action-blue', size: 'h-16 w-16' },
  { inputKey: 'j', label: 'J', sub: 'Ringan', tone: 'action-paper', size: 'h-16 w-16' },
  { inputKey: 'f', label: 'F', sub: 'Ambil', tone: 'action-yellow', size: 'h-14 w-14' },
  { inputKey: 'e', label: 'E', sub: 'Masak', tone: 'action-orange', size: 'h-14 w-14' },
  { inputKey: 'q', label: 'Q', sub: 'Buang', tone: 'action-dark', size: 'h-14 w-14' },
] as const;

export default function MobileControls({ onPause }: MobileControlsProps) {
  const [show, setShow] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const held = useRef<Set<string>>(new Set());
  const dragging = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setShow(isTouchDevice());
  }, []);

  useEffect(() => {
    return () => {
      for (const key of held.current) releaseKey(key);
      held.current.clear();
    };
  }, []);

  if (!show) return null;

  const setDirection = (dx: number, dy: number) => {
    const next = new Set<string>();
    if (Math.hypot(dx, dy) > DEADZONE) {
      if (dy < -DEADZONE) next.add('w');
      if (dy > DEADZONE) next.add('s');
      if (dx < -DEADZONE) next.add('a');
      if (dx > DEADZONE) next.add('d');
    }

    for (const key of held.current) {
      if (!next.has(key)) {
        releaseKey(key);
        held.current.delete(key);
      }
    }
    for (const key of next) {
      if (!held.current.has(key)) {
        pressKey(key);
        held.current.add(key);
      }
    }
  };

  const onJoyMove = (e: React.PointerEvent) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const mag = Math.hypot(dx, dy);
    if (mag > MAX_KNOB) {
      dx = (dx / mag) * MAX_KNOB;
      dy = (dy / mag) * MAX_KNOB;
    }
    setKnob({ x: dx, y: dy });
    setDirection(dx, dy);
  };

  const onJoyStart = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onJoyMove(e);
  };

  const onJoyEnd = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = false;
    setKnob({ x: 0, y: 0 });
    for (const key of held.current) releaseKey(key);
    held.current.clear();
  };

  const actionHandlers = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      pressKey(key);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      releaseKey(key);
    },
    onPointerCancel: () => releaseKey(key),
    onPointerLeave: () => releaseKey(key),
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none touch-none">
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          onPause();
        }}
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top))', right: 'calc(0.75rem + env(safe-area-inset-right))' }}
        className="pointer-events-auto absolute flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#2c1621] bg-[#ffcf5a] text-[#2c1621] shadow-[4px_5px_0_#2c1621] active:translate-y-1 active:shadow-[2px_2px_0_#2c1621]"
        aria-label="Pause"
      >
        <span className="mb-0.5 font-pixel text-[10px] leading-none">II</span>
      </button>

      <div
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))', left: 'calc(1rem + env(safe-area-inset-left))' }}
        className="pointer-events-none absolute flex flex-col items-center gap-2"
      >
        <div
          ref={baseRef}
          onPointerDown={onJoyStart}
          onPointerMove={(e) => dragging.current && onJoyMove(e)}
          onPointerUp={onJoyEnd}
          onPointerCancel={onJoyEnd}
          className="pointer-events-auto relative h-36 w-36 rounded-full border-[5px] border-[#2c1621] bg-[#fff7d8]/78 shadow-[7px_8px_0_rgba(44,22,33,.86),inset_0_6px_0_rgba(255,255,255,.38)]"
        >
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2c1621]/20" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2c1621]/55" />
          <div
            className="absolute left-1/2 top-1/2 h-[4.4rem] w-[4.4rem] rounded-full border-[4px] border-[#2c1621] bg-[#4d96ff] shadow-[0_8px_0_rgba(44,22,33,.55),inset_0_5px_0_rgba(255,255,255,.3)]"
            style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
          />
        </div>
      </div>

      <div
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))', right: 'calc(1rem + env(safe-area-inset-right))' }}
        className="pointer-events-none absolute grid w-[15.5rem] grid-cols-3 grid-rows-2 items-end justify-items-end gap-2"
      >
        {ACTIONS.map((action) => (
          <ActionButton key={action.inputKey} {...action} {...actionHandlers(action.inputKey)} />
        ))}
      </div>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  sub: string;
  tone: string;
  size: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
}

function ActionButton({ label, sub, tone, size, ...handlers }: ActionButtonProps) {
  return (
    <button
      {...handlers}
      className={`mobile-action ${tone} pointer-events-auto flex ${size} touch-none flex-col items-center justify-center rounded-full border-[4px] border-[#2c1621] shadow-[0_7px_0_rgba(44,22,33,.72),inset_0_5px_0_rgba(255,255,255,.28)] transition-transform active:translate-y-1 active:scale-95 active:shadow-[0_3px_0_rgba(44,22,33,.72)]`}
    >
      <span className="font-pixel text-[11px] leading-none">{label}</span>
      <span className="mt-1 font-game text-base font-bold leading-none">{sub}</span>
    </button>
  );
}
