import Modal from '../common/Modal';
import Button from '../common/Button';

interface PauseMenuProps {
  open: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSaveExit: () => void;
}

/** Overlay pause "game ditempel stiker". */
export default function PauseMenu({ open, onResume, onRestart, onSaveExit }: PauseMenuProps) {
  return (
    <Modal open={open} title="⏸️ JEDA">
      <div className="flex flex-col gap-3">
        <Button onClick={onResume}>▶ Resume</Button>
        <Button variant="ghost" onClick={onRestart}>
          ↺ Restart
        </Button>
        <Button variant="ghost" onClick={onSaveExit}>
          💾 Simpan &amp; Keluar
        </Button>
      </div>
    </Modal>
  );
}
