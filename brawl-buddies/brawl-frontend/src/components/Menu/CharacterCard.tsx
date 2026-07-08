import type { CharacterDef } from '../../game/entities/characters';

interface CharacterCardProps {
  def: CharacterDef;
  selected?: boolean;
  onSelect?: () => void;
}

export default function CharacterCard({ def, selected, onSelect }: CharacterCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`chaos-card flex w-56 flex-col items-center gap-2 p-5 text-center transition ${
        selected ? 'scale-105 brightness-105' : 'hover:-translate-y-1 hover:brightness-105'
      }`}
    >
      <span className="text-6xl">{def.emoji}</span>
      <span className="font-impact-game text-3xl uppercase leading-none text-[#2c1621] [text-shadow:2px_2px_0_#ffcf5a]">
        {def.name}
      </span>
      <span className="font-game text-center text-xl leading-none text-[#6d3b2d]">{def.title}</span>
      <span className="order-ticket mt-2 px-2 py-1 font-pixel text-[9px] leading-relaxed text-[#c4203d]">
        SPD {def.stats.speed} / PWR {def.stats.power} / DEF {def.stats.defense}
      </span>
    </button>
  );
}
