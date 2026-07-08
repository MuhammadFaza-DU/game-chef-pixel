import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import Button from '../components/common/Button';

export default function LeaderboardPage() {
  const nav = useNavigate();

  return (
    <div className="kitchen-screen flex min-h-screen flex-col items-center justify-center gap-6 p-5 sm:p-8">
      <Leaderboard />
      <Button className="secondary" variant="ghost" onClick={() => nav('/')}>
        Kembali Ke Menu
      </Button>
    </div>
  );
}
