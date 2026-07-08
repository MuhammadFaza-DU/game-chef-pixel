interface ComboCounterProps {
  hits: number;
  multiplier: number;
  score: number;
}

export default function ComboCounter({ hits, multiplier, score }: ComboCounterProps) {
  const frenzy = multiplier >= 5;

  return (
    <div className="flex flex-col items-center gap-1">
      {hits > 0 && (
        <span className={`rounded-full border-2 border-[#2c1621] px-2 py-1 font-pixel text-[8px] shadow-[3px_3px_0_#2c1621] sm:text-xs ${frenzy ? 'animate-pulse bg-[#ff4c55] text-white' : 'bg-[#ffcf5a] text-[#2c1621]'}`}>
          {frenzy ? 'FRENZY' : 'COMBO'} x{multiplier}
        </span>
      )}
      <div className="hud-panel px-2 py-1 sm:px-4">
        <span className="font-game text-lg font-bold leading-none text-[#351827] sm:text-2xl">
          Skor {score.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
}
