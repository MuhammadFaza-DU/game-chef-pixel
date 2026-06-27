import Modal from '../common/Modal';
import Button from '../common/Button';

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

/** Muncul saat boss kalah & masih ada world berikutnya. */
export default function WorldClearModal({ data, onNext, onReselect, onSaveExit }: WorldClearModalProps) {
  return (
    <Modal open={!!data} title={`🏆 WORLD ${data?.world ?? ''} BERHASIL DITAKLUKKAN!`}>
      <div className="flex flex-col gap-3">
        <p className="text-center text-lg font-bold text-chaos-yellow">Skor: {data?.score ?? 0}</p>
        <Button onClick={onNext}>➡️ Lanjut World Berikutnya</Button>
        <Button variant="ghost" onClick={onReselect}>
          🔄 Pilih Ulang Karakter
        </Button>
        <Button variant="ghost" onClick={onSaveExit}>
          💾 Simpan &amp; Keluar
        </Button>
      </div>
    </Modal>
  );
}
