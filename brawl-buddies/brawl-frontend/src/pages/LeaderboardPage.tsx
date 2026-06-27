import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import Button from '../components/common/Button';

export default function LeaderboardPage() {
  const nav = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-chaos-ink p-6">
      <Leaderboard />
      <Button variant="ghost" onClick={() => nav('/')}>
        ← Kembali
      </Button>
    </div>
  );
}
