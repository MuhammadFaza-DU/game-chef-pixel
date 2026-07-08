import Modal from '../common/Modal';

export interface WorldClearData {
  world: number;
  score: number;
}

interface WorldClearModalProps {
  data: WorldClearData | null;
  onNext: () => void;
  onReselect: () => void;
  onSaveExit: () => void;
}

export default function WorldClearModal({ data, onNext, onReselect, onSaveExit }: WorldClearModalProps) {
  return (
    <Modal open={!!data} title={`World ${data?.world ?? ''} Takluk!`}>
      <div className="flex w-[min(86vw,420px)] flex-col gap-3">
        <div className="order-ticket px-4 py-4 text-center">
          <p className="font-game text-2xl font-bold leading-none text-[#c4203d]">Order boss sudah gosong.</p>
          <p className="mt-2 font-pixel text-[11px] leading-relaxed text-[#351827]">
            SKOR {Number(data?.score ?? 0).toLocaleString('id-ID')}
          </p>
        </div>
        <button className="chaos-button" onClick={onNext}>Lanjut World</button>
        <button className="chaos-button secondary" onClick={onReselect}>Pilih Chef Lagi</button>
        <button className="chaos-button dark" onClick={onSaveExit}>Simpan &amp; Keluar</button>
      </div>
    </Modal>
  );
}
