import Modal from '../common/Modal';
import Button from '../common/Button';

interface PauseMenuProps {
  open: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSaveExit: () => void;
}

const RECIPES = [
  { mix: 'Ayam + Cabai', dish: 'Ayam Geprek', effect: 'Damage x1.5' },
  { mix: 'Tomat + Bawang', dish: 'Sambal', effect: 'Serangan area' },
  { mix: 'Telur + Keju', dish: 'Omelet', effect: '+40 HP' },
  { mix: 'Pisang + Es', dish: 'Es Pisang', effect: 'Bekukan musuh' },
  { mix: '4 bahan berbeda', dish: 'Nasi Goreng Kosmik', effect: 'Damage x3' },
];

export default function PauseMenu({ open, onResume, onRestart, onSaveExit }: PauseMenuProps) {
  return (
    <Modal open={open} title="JEDA">
      <div className="grid max-h-[78vh] gap-4 overflow-y-auto sm:w-[34rem] sm:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <Button onClick={onResume}>Resume</Button>
          <Button variant="ghost" onClick={onRestart}>
            Restart
          </Button>
          <Button variant="ghost" onClick={onSaveExit}>
            Simpan &amp; Keluar
          </Button>
        </div>

        <section className="pixel-panel-border px-3 py-3">
          <h3 className="font-pixel mb-3 text-center text-[9px] leading-relaxed text-chaos-yellow">
            BUKU RESEP
          </h3>
          <div className="flex flex-col gap-2">
            {RECIPES.map((recipe) => (
              <div key={recipe.dish} className="rounded bg-white/5 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-game text-lg font-bold leading-none text-white">{recipe.dish}</span>
                  <span className="font-game text-base font-bold leading-none text-chaos-yellow">{recipe.effect}</span>
                </div>
                <div className="mt-1 font-game text-base leading-none text-white/70">{recipe.mix}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
