interface ComboCounterProps {
  hits: number;
  multiplier: number;
  score: number;
}

/** Penampil combo & score dengan font pixel art. FRENZY saat x5. */
export default function ComboCounter({ hits, multiplier, score }: ComboCounterProps) {
  const frenzy = multiplier >= 5;
  return (
    <div className="flex flex-col items-center gap-1">
      {hits > 0 && (
        <span
          className={`font-pixel text-[8px] drop-shadow sm:text-xs ${frenzy ? 'animate-pulse text-chaos-red' : 'text-chaos-yellow'}`}
        >
          {frenzy ? 'FRENZY' : 'COMBO'} x{multiplier}!
        </span>
      )}
      <div className="pixel-panel px-2 py-1 sm:px-4">
        <span className="font-game text-sm text-white sm:text-lg">
          SCORE: {score.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
}
