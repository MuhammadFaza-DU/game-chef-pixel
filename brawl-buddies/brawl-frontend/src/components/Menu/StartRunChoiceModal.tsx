import Modal from '../common/Modal';

interface StartRunChoiceModalProps {
  open: boolean;
  savedWorld: number | null;
  onContinue: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export default function StartRunChoiceModal({
  open,
  savedWorld,
  onContinue,
  onNewGame,
  onClose,
}: StartRunChoiceModalProps) {
  const world = savedWorld ?? 1;

  return (
    <Modal open={open} title="Order Main" onClose={onClose}>
      <div className="w-[min(88vw,500px)] space-y-4">
        <div className="order-ticket px-4 py-3 text-center">
          <p className="font-game text-2xl leading-none">
            Tiket lama tersimpan di <span className="font-bold text-[#c4203d]">World {world}</span>
          </p>
          <p className="mt-1 font-game text-lg leading-none text-[#6d3b2d]">
            Pilih mau lanjut masakan lama atau buka dapur baru.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="chaos-button min-h-[6.4rem] flex-col items-start justify-center text-left" onClick={onContinue}>
            <span className="font-game text-xl leading-none">Panaskan Lagi</span>
            <span className="mt-2 font-pixel text-[10px] leading-relaxed">LANJUT WORLD {world}</span>
          </button>
          <button className="chaos-button dark min-h-[6.4rem] flex-col items-start justify-center text-left" onClick={onNewGame}>
            <span className="font-game text-xl leading-none text-[#ffcf5a]">Dapur Baru</span>
            <span className="mt-2 font-pixel text-[10px] leading-relaxed">ULANG WORLD 1</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
