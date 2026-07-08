import Modal from '../common/Modal';

interface StartRunChoiceModalProps {
  open: boolean;
  savedWorld: number | null;
  onContinue: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

/** Pilihan start saat ada save aktif: resume run atau reset ke World 1. */
export default function StartRunChoiceModal({
  open,
  savedWorld,
  onContinue,
  onNewGame,
  onClose,
}: StartRunChoiceModalProps) {
  const world = savedWorld ?? 1;

  return (
    <Modal open={open} title="PILIH MODE MAIN" onClose={onClose}>
      <div className="w-[min(88vw,460px)] space-y-4">
        <div className="pixel-panel-border px-4 py-3 text-center">
          <p className="font-game text-xl text-white">
            Save ditemukan di <span className="font-bold text-chaos-yellow">World {world}</span>
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="border-2 border-chaos-yellow/80 bg-chaos-yellow px-4 py-4 text-left text-chaos-ink shadow-[0_0_16px_rgba(255,217,61,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,217,61,0.38)] active:translate-y-0"
            onClick={onContinue}
          >
            <span className="font-pixel block text-[10px] leading-relaxed">LANJUTKAN</span>
            <span className="font-game mt-2 block text-xl leading-none">Mulai dari World {world}</span>
          </button>
          <button
            className="border-2 border-chaos-red/80 bg-[#160711] px-4 py-4 text-left text-white shadow-[0_0_16px_rgba(255,71,87,0.18)] transition hover:-translate-y-0.5 hover:border-chaos-red hover:shadow-[0_0_24px_rgba(255,71,87,0.32)] active:translate-y-0"
            onClick={onNewGame}
          >
            <span className="font-pixel block text-[10px] leading-relaxed text-chaos-red">GAME BARU</span>
            <span className="font-game mt-2 block text-xl leading-none text-white/90">Ulang dari World 1</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
