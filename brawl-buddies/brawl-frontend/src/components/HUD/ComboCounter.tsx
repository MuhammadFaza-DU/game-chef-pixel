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
          className={`font-pixel text-xs drop-shadow ${frenzy ? 'animate-pulse text-chaos-red' : 'text-chaos-yellow'}`}
        >
          {frenzy ? 'FRENZY' : 'COMBO'} x{multiplier}!
        </span>
      )}
      <div className="pixel-panel px-4 py-1">
        <span className="font-game text-lg text-white">
          SCORE: {score.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
}
