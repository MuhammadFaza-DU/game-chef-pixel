import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { setTutorialMode } from '../../game/tutorialMode';

/** Siluet koki hero — CSS SVG, warna diatur via className parent */
function ChefSvg() {
  return (
    <svg viewBox="0 0 200 420" fill="currentColor" className="h-full w-auto">
      {/* topi: 3 gembung */}
      <ellipse cx="68"  cy="72" rx="36" ry="44" />
      <ellipse cx="100" cy="54" rx="46" ry="58" />
      <ellipse cx="132" cy="72" rx="36" ry="44" />
      {/* pita topi */}
      <rect x="36" y="108" width="128" height="22" rx="6" />
      {/* kepala */}
      <circle cx="100" cy="166" r="54" />
      {/* mata ramah (lubang negatif) */}
      <circle cx="83"  cy="158" r="8"  fill="#1a1a2e" />
      <circle cx="117" cy="158" r="8"  fill="#1a1a2e" />
      {/* senyum */}
      <path d="M82 180 Q100 198 118 180" stroke="#1a1a2e" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* badan jubah */}
      <path d="M46 214 Q36 360 40 400 H160 Q164 360 154 214 Z" />
      {/* sabuk */}
      <rect x="44" y="306" width="112" height="20" rx="5" fill="#1a1a2e" />
      {/* kancing apron */}
      <circle cx="100" cy="268" r="7" fill="#1a1a2e" />
      <circle cx="100" cy="245" r="7" fill="#1a1a2e" />
    </svg>
  );
}

/** Siluet bos bermahkota — CSS SVG */
function BossSvg() {
  return (
    <svg viewBox="0 0 220 420" fill="currentColor" className="h-full w-auto">
      {/* mahkota */}
      <polygon points="30,110 55,38 85,88 110,18 135,88 165,38 190,110" />
      {/* kepala lebih besar */}
      <circle cx="110" cy="172" r="62" />
      {/* alis galak */}
      <polygon points="74,150 94,162 74,168"  fill="#1a1a2e" />
      <polygon points="146,150 126,162 146,168" fill="#1a1a2e" />
      {/* mata menyala */}
      <circle cx="88"  cy="165" r="9" fill="#ff4757" />
      <circle cx="132" cy="165" r="9" fill="#ff4757" />
      {/* taring */}
      <polygon points="98,196 106,196 102,212"  fill="#1a1a2e" />
      <polygon points="114,196 122,196 118,212" fill="#1a1a2e" />
      {/* badan lebih lebar */}
      <path d="M32 228 Q20 370 26 406 H194 Q200 370 188 228 Z" />
      {/* kerah bergerigi */}
      <polygon points="32,228 56,202 80,228"  />
      <polygon points="86,222 110,196 134,222" />
      <polygon points="140,228 164,202 188,228" />
      {/* sabuk */}
      <rect x="28" y="316" width="164" height="22" rx="5" fill="#1a1a2e" />
      {/* gesper */}
      <rect x="98" y="314" width="24" height="26" rx="4" fill="#1a1a2e" />
    </svg>
  );
}

/** Menu utama — siluet koki CSS, musik autoplay, judul glitch. */
export default function MainMenu() {
  const nav = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.38;
    audio.muted = localStorage.getItem('brawl-muted') === '1';

    const tryPlay = () => { audio.play().catch(() => {}); };
    tryPlay();
    // fallback jika browser blokir autoplay
    document.addEventListener('pointerdown', tryPlay, { once: true });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener('pointerdown', tryPlay);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center justify-center select-none">
      <audio ref={audioRef} src="/audio/bgm/menu.mp3" loop />

      {/* ── Layer 1: background gradient ───────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d1f] via-[#1a1a2e] to-[#0a0a18]" />

      {/* ── Layer 2: spotlight radial di tengah ────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,rgba(255,71,87,0.10)_0%,transparent_80%)]" />

      {/* ── Layer 3: garis scanline tipis ──────────────────────────── */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />

      {/* ── Siluet kiri: hero koki (biru) ──────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 h-[82vh] text-[#8ecdf7] opacity-[0.22]"
        style={{ filter: 'drop-shadow(0 0 28px rgba(142,205,247,0.55))' }}
      >
        <ChefSvg />
      </div>

      {/* ── Siluet kanan: boss (merah, mirror) ─────────────────────── */}
      <div
        className="absolute bottom-0 right-0 h-[82vh] text-[#ff4757] opacity-[0.22] scale-x-[-1]"
        style={{ filter: 'drop-shadow(0 0 28px rgba(255,71,87,0.55))' }}
      >
        <BossSvg />
      </div>

      {/* ── Konten tengah ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-4">

        {/* Judul: efek glitch + glow */}
        <h1 className="glitch font-pixel text-center text-4xl md:text-5xl leading-snug text-chaos-red"
            style={{ textShadow: '0 0 18px rgba(255,71,87,0.7), 4px 4px 0 #1a1a2e' }}>
          BRAWL<br />BUDDIES
        </h1>

        <h2 className="font-pixel text-center text-[11px] tracking-widest text-chaos-yellow glow-yellow">
          CHAOS KITCHEN
        </h2>

        <p className="font-game text-xl italic text-white/65 mt-1">
          "Masak atau Dipukul!"
        </p>

        {/* Divider dekoratif */}
        <div className="flex items-center gap-3 w-64">
          <div className="flex-1 h-px bg-chaos-red/40" />
          <span className="text-chaos-red/60 text-lg">⚔</span>
          <div className="flex-1 h-px bg-chaos-red/40" />
        </div>

        {/* Tombol */}
        <div className="flex flex-col gap-3 items-stretch w-60 mt-1">
          <Button onClick={() => nav('/play')} style={{ width: '100%' }}>MAIN SEKARANG</Button>
          <Button
            variant="ghost"
            style={{ width: '100%' }}
            onClick={() => { setTutorialMode(true); nav('/tutorial'); }}
          >
            TUTORIAL
          </Button>
          <Button variant="ghost" style={{ width: '100%' }} onClick={() => nav('/leaderboard')}>
            LEADERBOARD
          </Button>
          <Button variant="ghost" style={{ width: '100%' }} onClick={() => nav('/profile')}>
            PROFIL
          </Button>
        </div>

        {/* Versi kecil di bawah */}
        <p className="font-game text-[10px] text-white/25 mt-4 tracking-wider">
          v0.1 · CHAOS KITCHEN STUDIO
        </p>
      </div>

      <style>{`
        /* Scanlines */
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.18) 3px,
            rgba(0,0,0,0.18) 4px
          );
        }

        /* Glow kuning subtitle */
        .glow-yellow {
          text-shadow: 0 0 14px rgba(255,217,61,0.75), 0 0 32px rgba(255,217,61,0.35);
        }

        /* Glitch judul — berkedip acak setiap ~3 detik */
        .glitch {
          animation: glitch 3.8s infinite;
        }
        @keyframes glitch {
          0%,  92%  { text-shadow: 0 0 18px rgba(255,71,87,0.7), 4px 4px 0 #1a1a2e; transform: none; }
          93%        { text-shadow: -3px 0 #ffd93d, 3px 0 #4D96FF, 0 0 18px rgba(255,71,87,0.7); transform: translateX(-2px) skewX(-1deg); }
          94%        { text-shadow: 3px 0 #ffd93d, -3px 0 #4D96FF, 0 0 18px rgba(255,71,87,0.7); transform: translateX(3px) skewX(1deg); }
          95%        { text-shadow: -2px 0 #ffd93d, 2px 0 #ff4757, 0 0 18px rgba(255,71,87,0.7); transform: translateX(-1px); }
          96%        { text-shadow: 0 0 18px rgba(255,71,87,0.7), 4px 4px 0 #1a1a2e; transform: none; }
          97%        { text-shadow: 2px 0 #4D96FF, -2px 0 #ffd93d, 0 0 18px rgba(255,71,87,0.7); transform: translateX(2px) skewX(-0.5deg); }
          98%        { text-shadow: 0 0 18px rgba(255,71,87,0.7), 4px 4px 0 #1a1a2e; transform: none; }
          100%       { text-shadow: 0 0 18px rgba(255,71,87,0.7), 4px 4px 0 #1a1a2e; transform: none; }
        }
      `}</style>
    </div>
  );
}
