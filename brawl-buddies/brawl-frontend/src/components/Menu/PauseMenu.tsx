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
    <Modal open={open} title="Dapur Dijeda">
      <div className="grid max-h-[78vh] gap-4 overflow-y-auto sm:w-[38rem] sm:grid-cols-[0.9fr_1.25fr]">
        <div className="flex flex-col gap-3">
          <div className="order-ticket px-3 py-3">
            <p className="font-game text-2xl font-bold leading-none text-[#c4203d]">Service berhenti sebentar.</p>
            <p className="mt-1 font-game text-lg leading-none text-[#6d3b2d]">Cek resep, tarik napas, lalu hajar lagi.</p>
          </div>
          <Button onClick={onResume}>Lanjut Masak</Button>
          <Button variant="ghost" onClick={onRestart}>Ulang Order</Button>
          <Button className="dark" variant="ghost" onClick={onSaveExit}>Simpan &amp; Keluar</Button>
        </div>

        <section className="order-ticket px-3 py-3">
          <h3 className="font-impact-game mb-3 text-center text-3xl leading-none text-[#2c1621] [text-shadow:2px_2px_0_#ffcf5a]">
            Buku Resep
          </h3>
          <div className="flex flex-col gap-2">
            {RECIPES.map((recipe) => (
              <div key={recipe.dish} className="rounded-lg border-2 border-[#2c1621] bg-white/70 px-3 py-2 shadow-[3px_3px_0_#2c1621]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-game text-xl font-bold leading-none text-[#351827]">{recipe.dish}</span>
                  <span className="font-game text-lg font-bold leading-none text-[#c4203d]">{recipe.effect}</span>
                </div>
                <div className="mt-1 font-game text-lg leading-none text-[#6d3b2d]">{recipe.mix}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
