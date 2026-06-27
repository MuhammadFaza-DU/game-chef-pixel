import type { CharacterDef } from '../../game/entities/characters';

interface CharacterCardProps {
  def: CharacterDef;
  selected?: boolean;
  onSelect?: () => void;
}

/** Kartu karakter di Character Select dengan frame pixel art. */
export default function CharacterCard({ def, selected, onSelect }: CharacterCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`pixel-panel flex w-56 flex-col items-center gap-2 p-5 transition ${
        selected ? 'scale-105 brightness-110' : 'hover:scale-105'
      }`}
      style={{ border: 'none', background: 'none' }}
    >
      <span className="text-6xl">{def.emoji}</span>
      <span className="font-pixel text-xs leading-relaxed text-chaos-yellow">{def.name}</span>
      <span className="font-game text-center text-sm text-white/90">{def.title}</span>
      <span className="font-game mt-2 text-sm text-chaos-yellow">
        SPD {def.stats.speed} · PWR {def.stats.power} · DEF {def.stats.defense}
      </span>
    </button>
  );
}
