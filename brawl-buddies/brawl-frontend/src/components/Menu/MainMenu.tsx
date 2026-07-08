import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StartRunChoiceModal from './StartRunChoiceModal';
import { setTutorialMode } from '../../game/tutorialMode';
import { setTargetWorld } from '../../game/targetWorld';
import { usePlayerStore } from '../../store/usePlayerStore';

function ChefHeroSvg() {
  return (
    <svg viewBox="0 0 360 520" className="h-full w-auto" aria-hidden="true">
      <defs>
        <linearGradient id="chefCoat" x1="96" y1="170" x2="265" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff9e8" />
          <stop offset="1" stopColor="#d7e8ff" />
        </linearGradient>
        <linearGradient id="chefPan" x1="66" y1="240" x2="239" y2="315" gradientUnits="userSpaceOnUse">
          <stop stopColor="#27324c" />
          <stop offset="1" stopColor="#101524" />
        </linearGradient>
        <filter id="chefShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#07101f" floodOpacity=".45" />
        </filter>
      </defs>

      <g filter="url(#chefShadow)">
        <path d="M101 160c-32-13-44-53-18-82 12-14 29-18 45-14 8-28 34-48 66-48 33 0 59 20 67 50 18-4 39 3 51 21 19 29 6 64-23 76 5 10 3 25-8 34H110c-13-7-16-25-9-37Z" fill="#fff4d7" stroke="#3b2433" strokeWidth="8" strokeLinejoin="round" />
        <path d="M104 180h181v36c0 18-14 33-33 33H137c-19 0-33-15-33-33v-36Z" fill="#ffe2a3" stroke="#3b2433" strokeWidth="8" />
        <path d="M125 237c12-33 40-55 72-55 34 0 62 23 73 58l-6 94H131l-6-97Z" fill="#ffc66a" stroke="#3b2433" strokeWidth="8" />
        <path d="M151 257c12 11 28 17 46 17 18 0 35-6 47-18" fill="none" stroke="#3b2433" strokeWidth="7" strokeLinecap="round" />
        <circle cx="167" cy="224" r="9" fill="#1c1729" />
        <circle cx="226" cy="224" r="9" fill="#1c1729" />
        <path d="M179 244c8 6 24 6 33 0" fill="none" stroke="#1c1729" strokeWidth="7" strokeLinecap="round" />

        <path d="M97 310c12-42 45-68 99-68 56 0 89 26 102 68l24 177H73l24-177Z" fill="url(#chefCoat)" stroke="#3b2433" strokeWidth="8" strokeLinejoin="round" />
        <path d="M185 256v226" stroke="#3b2433" strokeWidth="7" strokeLinecap="round" />
        <circle cx="164" cy="322" r="7" fill="#3b2433" />
        <circle cx="164" cy="367" r="7" fill="#3b2433" />
        <circle cx="164" cy="412" r="7" fill="#3b2433" />
        <path d="M86 326c-31 18-45 44-43 77l62-2 8-67-27-8Z" fill="#fff9e8" stroke="#3b2433" strokeWidth="8" strokeLinejoin="round" />
        <path d="M274 332c37 12 56 37 56 72l-62-3-15-61 21-8Z" fill="#fff9e8" stroke="#3b2433" strokeWidth="8" strokeLinejoin="round" />

        <path d="M47 282c15-18 57-31 104-28 46 3 83 20 82 39-2 20-43 34-92 31-48-3-98-22-94-42Z" fill="url(#chefPan)" stroke="#3b2433" strokeWidth="8" />
        <path d="M219 274l88-37c13-6 27 2 31 15 4 12-3 25-16 29l-94 27-9-34Z" fill="#202a43" stroke="#3b2433" strokeWidth="8" strokeLinejoin="round" />
        <path d="M77 279c32 11 86 14 127 1" fill="none" stroke="#5c6884" strokeWidth="6" strokeLinecap="round" opacity=".65" />
        <path d="M55 230c-15-25-10-47 14-66M96 223c-6-23 0-41 19-55M132 230c11-20 9-40-7-59" fill="none" stroke="#ffcf5a" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function RivalChefSvg() {
  return (
    <svg viewBox="0 0 360 520" className="h-full w-auto" aria-hidden="true">
      <defs>
        <linearGradient id="rivalBody" x1="75" y1="212" x2="289" y2="501" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4203d" />
          <stop offset="1" stopColor="#671f34" />
        </linearGradient>
        <linearGradient id="rivalHat" x1="89" y1="20" x2="290" y2="176" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd159" />
          <stop offset="1" stopColor="#ff7b38" />
        </linearGradient>
        <filter id="rivalShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#170812" floodOpacity=".5" />
        </filter>
      </defs>

      <g filter="url(#rivalShadow)">
        <path d="M84 148 113 61l43 56 39-91 41 91 43-56 29 87c-42 26-168 26-224 0Z" fill="url(#rivalHat)" stroke="#391322" strokeWidth="8" strokeLinejoin="round" />
        <path d="M83 159c43 24 174 25 225 0l-4 38H88l-5-38Z" fill="#fbefbd" stroke="#391322" strokeWidth="8" strokeLinejoin="round" />
        <path d="M102 224c4-56 42-93 96-93 55 0 94 38 98 94 4 56-35 102-96 102s-102-47-98-103Z" fill="#ba4a4c" stroke="#391322" strokeWidth="8" />
        <path d="M139 209 179 228M258 209l-41 19" stroke="#250b17" strokeWidth="12" strokeLinecap="round" />
        <circle cx="166" cy="235" r="9" fill="#ffd159" />
        <circle cx="231" cy="235" r="9" fill="#ffd159" />
        <path d="M172 278c18 12 38 12 55 0" fill="none" stroke="#250b17" strokeWidth="9" strokeLinecap="round" />
        <path d="M185 292 196 315 209 292" fill="#fff3d4" stroke="#250b17" strokeWidth="5" strokeLinejoin="round" />

        <path d="M80 337c11-60 51-94 119-94 67 0 107 35 119 94l18 154H61l19-154Z" fill="url(#rivalBody)" stroke="#391322" strokeWidth="8" strokeLinejoin="round" />
        <path d="M78 342 38 399l59 34 35-65-54-26Z" fill="#b7253f" stroke="#391322" strokeWidth="8" strokeLinejoin="round" />
        <path d="M320 342c29 16 45 40 48 72l-68 21-30-70 50-23Z" fill="#b7253f" stroke="#391322" strokeWidth="8" strokeLinejoin="round" />
        <path d="M127 455h147" stroke="#190912" strokeWidth="20" strokeLinecap="round" />
        <path d="M188 248v232" stroke="#391322" strokeWidth="7" strokeLinecap="round" opacity=".7" />
        <path d="M258 315c22-22 47-27 76-15" fill="none" stroke="#ffd159" strokeWidth="9" strokeLinecap="round" />
        <path d="M66 302c34-13 64-7 90 20" fill="none" stroke="#ffd159" strokeWidth="9" strokeLinecap="round" />
        <path d="M68 253c-23-14-31-32-23-54M301 252c26-11 38-29 35-55" fill="none" stroke="#ffd159" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

type MenuButtonProps = {
  label: string;
  kicker: string;
  tone: 'primary' | 'paper' | 'blue' | 'dark';
  onClick: () => void;
};

function MenuButton({ label, kicker, tone, onClick }: MenuButtonProps) {
  return (
    <button className={`menu-ticket menu-ticket-${tone}`} onClick={onClick}>
      <span className="ticket-kicker">{kicker}</span>
      <span className="ticket-label">{label}</span>
      <span className="ticket-notch" />
    </button>
  );
}

export default function MainMenu() {
  const nav = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const savedWorld = usePlayerStore((s) => s.savedWorld);
  const hasSavedRun = usePlayerStore((s) => s.hasSavedRun);
  const getStartWorld = usePlayerStore((s) => s.getStartWorld);
  const clearSavedRun = usePlayerStore((s) => s.clearSavedRun);
  const [showStartChoice, setShowStartChoice] = useState(false);

  const startFromWorld = (world: number) => {
    setTutorialMode(false);
    setTargetWorld(world);
    nav('/play');
  };

  const handlePlay = () => {
    if (hasSavedRun()) {
      setShowStartChoice(true);
      return;
    }

    startFromWorld(1);
  };

  const handleContinue = () => {
    setShowStartChoice(false);
    startFromWorld(getStartWorld());
  };

  const handleNewGame = () => {
    clearSavedRun();
    setShowStartChoice(false);
    startFromWorld(1);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.38;
    audio.muted = localStorage.getItem('brawl-muted') === '1';

    const tryPlay = () => {
      audio.play().catch(() => {});
    };
    tryPlay();
    document.addEventListener('pointerdown', tryPlay, { once: true });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener('pointerdown', tryPlay);
    };
  }, []);

  return (
    <div className="chaos-menu relative min-h-screen overflow-hidden select-none">
      <audio ref={audioRef} src="/audio/bgm/menu.mp3" loop />

      <div className="kitchen-wall" />
      <div className="floor-grid" />
      <div className="sauce-splash sauce-left" />
      <div className="sauce-splash sauce-right" />

      <div className="steam steam-a" />
      <div className="steam steam-b" />
      <div className="steam steam-c" />

      <div className="menu-prop prop-pan" />
      <div className="menu-prop prop-knife" />
      <div className="menu-prop prop-ticket" />
      <div className="menu-prop prop-tomato" />

      <section className="menu-stage relative z-10 grid min-h-screen grid-cols-[minmax(160px,1fr)_minmax(300px,520px)_minmax(160px,1fr)] items-end gap-4 px-5 py-6 md:px-8 lg:px-14">
        <div className="character-side chef-side">
          <ChefHeroSvg />
        </div>

        <main className="order-board mb-4 self-center">
          <div className="brand-plaque">
            <div className="logo-pan-shadow" />
            <p className="brand-kicker">Order up. Gloves on.</p>
            <h1 className="brand-title" aria-label="Brawl Buddies">
              <span>BRAWL</span>
              <span>BUDDIES</span>
            </h1>
            <div className="brand-subtitle">
              <span>CHAOS</span>
              <span>KITCHEN</span>
            </div>
          </div>

          <div className="special-ticket">
            <span>Today's special</span>
            <strong>Masak cepat, pukul tepat.</strong>
          </div>

          <nav className="menu-actions" aria-label="Menu utama">
            <MenuButton label="Main Sekarang" kicker="HOT" tone="primary" onClick={handlePlay} />
            <MenuButton
              label="Tutorial"
              kicker="PREP"
              tone="paper"
              onClick={() => {
                setTutorialMode(true);
                nav('/tutorial');
              }}
            />
            <MenuButton label="Leaderboard" kicker="TOP" tone="blue" onClick={() => nav('/leaderboard')} />
            <MenuButton label="Profil" kicker="ID" tone="dark" onClick={() => nav('/profile')} />
          </nav>

          <p className="studio-mark">v0.1 / Chaos Kitchen Studio</p>
        </main>

        <div className="character-side rival-side">
          <RivalChefSvg />
        </div>
      </section>

      <StartRunChoiceModal
        open={showStartChoice}
        savedWorld={savedWorld}
        onContinue={handleContinue}
        onNewGame={handleNewGame}
        onClose={() => setShowStartChoice(false)}
      />

      <style>{`
        .chaos-menu {
          background:
            radial-gradient(circle at 50% 22%, rgba(255, 215, 86, 0.22), transparent 26rem),
            linear-gradient(180deg, #2b1231 0%, #35182c 43%, #17111f 100%);
          color: #fff9e8;
          isolation: isolate;
        }

        .kitchen-wall {
          position: absolute;
          inset: 0 0 42%;
          background:
            linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 192, 72, .12), rgba(255,255,255,0));
          background-size: 54px 34px, 54px 34px, 100% 100%;
          transform: skewY(-1deg);
          transform-origin: top left;
        }

        .floor-grid {
          position: absolute;
          inset: 46% -8% -12%;
          background:
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(180deg, #3f2431, #15101d 72%);
          background-size: 92px 100%, 100% 52px, 100% 100%;
          transform: perspective(520px) rotateX(58deg);
          transform-origin: top;
        }

        .sauce-splash,
        .steam,
        .menu-prop {
          pointer-events: none;
          position: absolute;
        }

        .sauce-splash {
          width: 26rem;
          aspect-ratio: 1;
          border-radius: 41% 59% 43% 57%;
          opacity: .22;
          filter: blur(.4px);
        }

        .sauce-left {
          left: -8rem;
          top: 14%;
          background: #34c98f;
          transform: rotate(-22deg);
        }

        .sauce-right {
          right: -7rem;
          bottom: 9%;
          background: #ff3d53;
          transform: rotate(18deg);
        }

        .steam {
          width: 1.9rem;
          height: 9rem;
          border-radius: 999px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,.26), transparent);
          animation: steam-rise 5.5s ease-in-out infinite;
          opacity: .45;
        }

        .steam-a { left: 21%; top: 13%; }
        .steam-b { left: 73%; top: 17%; animation-delay: -1.8s; }
        .steam-c { left: 55%; top: 6%; animation-delay: -3.2s; }

        .menu-prop {
          z-index: 1;
          opacity: .9;
        }

        .prop-pan {
          left: 6%;
          top: 10%;
          width: 8rem;
          height: 3.5rem;
          border: .45rem solid #151323;
          border-radius: 50%;
          background: #2f3850;
          transform: rotate(-18deg);
          box-shadow: inset 0 .35rem 0 rgba(255,255,255,.12);
        }

        .prop-pan::after {
          content: "";
          position: absolute;
          right: -5.8rem;
          top: 1rem;
          width: 6.4rem;
          height: .9rem;
          border-radius: 999px;
          background: #151323;
        }

        .prop-knife {
          right: 7%;
          top: 12%;
          width: 9rem;
          height: 1rem;
          border-radius: 999px;
          background: linear-gradient(90deg, #d9e3f1 0 62%, #2c1931 62%);
          transform: rotate(22deg);
          box-shadow: 0 .25rem 0 rgba(0,0,0,.24);
        }

        .prop-ticket {
          left: 13%;
          bottom: 10%;
          width: 6.2rem;
          height: 8.2rem;
          border: .22rem solid #241221;
          border-radius: .45rem;
          background: repeating-linear-gradient(180deg, #fff0be 0 1.4rem, #ffd879 1.4rem 1.55rem);
          transform: rotate(9deg);
        }

        .prop-tomato {
          right: 17%;
          bottom: 14%;
          width: 4.2rem;
          aspect-ratio: 1;
          border: .34rem solid #2a1421;
          border-radius: 50%;
          background: #ff3d53;
          transform: rotate(-12deg);
        }

        .prop-tomato::before {
          content: "";
          position: absolute;
          left: 1.2rem;
          top: -.7rem;
          width: 1.4rem;
          height: 1.3rem;
          background: #34c98f;
          clip-path: polygon(50% 0, 65% 42%, 100% 36%, 72% 60%, 88% 100%, 50% 74%, 12% 100%, 28% 60%, 0 36%, 35% 42%);
        }

        .menu-stage {
          max-width: 1420px;
          margin: 0 auto;
        }

        .character-side {
          position: relative;
          height: min(80vh, 38rem);
          min-height: 24rem;
          align-self: end;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .chef-side {
          transform: rotate(-2deg) translateY(1.5rem);
        }

        .rival-side {
          transform: rotate(2deg) translateY(1.8rem);
        }

        .order-board {
          position: relative;
          width: min(100%, 32rem);
          margin-inline: auto;
          padding: 1rem;
        }

        .order-board::before {
          content: "";
          position: absolute;
          inset: 5.7rem .1rem .6rem;
          z-index: -1;
          border: .34rem solid #2c1621;
          border-radius: 1.1rem;
          background:
            linear-gradient(180deg, rgba(255,247,216,.96), rgba(255,222,134,.94)),
            repeating-linear-gradient(0deg, transparent 0 1.5rem, rgba(87,39,31,.1) 1.5rem 1.58rem);
          box-shadow: 0 1.2rem 0 rgba(31, 12, 25, .72), 0 1.9rem 3rem rgba(0, 0, 0, .28);
          transform: rotate(-1.2deg);
        }

        .brand-plaque {
          position: relative;
          padding: .85rem .95rem 1rem;
          border: .35rem solid #2c1621;
          border-radius: 1.3rem;
          background: linear-gradient(135deg, #fff0a9, #ffb84f 46%, #ff4c55 47%, #b72242);
          box-shadow: 0 .75rem 0 #2c1621, 0 1.2rem 2.4rem rgba(0,0,0,.26);
          transform: rotate(.8deg);
        }

        .logo-pan-shadow {
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: .7rem;
          height: .7rem;
          border-radius: 999px;
          background: rgba(44,22,33,.22);
        }

        .brand-kicker {
          margin: 0 0 .25rem;
          color: #331625;
          font-family: "Monogram", monospace;
          font-size: clamp(1.05rem, 2.3vw, 1.45rem);
          letter-spacing: .02em;
          text-align: center;
        }

        .brand-title {
          margin: 0;
          color: #fff9e8;
          font-family: Impact, "Arial Black", system-ui, sans-serif;
          font-size: clamp(3.1rem, 8vw, 5.45rem);
          line-height: .76;
          letter-spacing: 0;
          text-align: center;
          text-transform: uppercase;
          text-shadow: .08em .08em 0 #2c1621, -.035em .035em 0 #2c1621;
        }

        .brand-title span {
          display: block;
        }

        .brand-subtitle {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          gap: .5rem;
          margin-top: .55rem;
          color: #2c1621;
          font-family: "PressStart2P", monospace;
          font-size: clamp(.62rem, 1.5vw, .85rem);
        }

        .brand-subtitle span {
          border: .18rem solid #2c1621;
          border-radius: .45rem;
          background: #fff9e8;
          padding: .38rem .48rem;
          box-shadow: .18rem .18rem 0 #2c1621;
        }

        .special-ticket {
          position: relative;
          z-index: 1;
          width: min(88%, 24rem);
          margin: 1.35rem auto .95rem;
          border: .2rem dashed #7a3d29;
          border-radius: .85rem;
          background: #fff7d8;
          padding: .72rem .85rem;
          color: #351827;
          text-align: center;
          transform: rotate(1.1deg);
        }

        .special-ticket span {
          display: block;
          font-family: "Monogram", monospace;
          font-size: 1.05rem;
          color: #8c3a2d;
        }

        .special-ticket strong {
          display: block;
          margin-top: .08rem;
          font-family: "PressStart2P", monospace;
          font-size: clamp(.56rem, 1.3vw, .7rem);
          line-height: 1.55;
        }

        .menu-actions {
          position: relative;
          z-index: 1;
          display: grid;
          gap: .68rem;
          width: min(100%, 24rem);
          margin: 0 auto;
        }

        .menu-ticket {
          position: relative;
          display: grid;
          grid-template-columns: 3.1rem 1fr 1.4rem;
          align-items: center;
          min-height: 4rem;
          border: .24rem solid #2c1621;
          border-radius: .75rem;
          padding: .38rem .65rem .38rem .3rem;
          cursor: pointer;
          color: #2c1621;
          text-align: left;
          box-shadow: .32rem .38rem 0 #2c1621;
          transform: rotate(var(--tilt, 0deg));
          transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
        }

        .menu-ticket:nth-child(1) { --tilt: -1deg; }
        .menu-ticket:nth-child(2) { --tilt: .8deg; }
        .menu-ticket:nth-child(3) { --tilt: -0.45deg; }
        .menu-ticket:nth-child(4) { --tilt: 1deg; }

        .menu-ticket:hover,
        .menu-ticket:focus-visible {
          transform: rotate(0deg) translate(-.08rem, -.12rem);
          box-shadow: .48rem .58rem 0 #2c1621;
          outline: none;
          filter: saturate(1.08);
        }

        .menu-ticket:active {
          transform: translate(.16rem, .18rem);
          box-shadow: .12rem .14rem 0 #2c1621;
        }

        .menu-ticket-primary {
          background: linear-gradient(180deg, #ffec5c, #ff9d35 54%, #ff4c55);
        }

        .menu-ticket-paper {
          background: linear-gradient(180deg, #fff9e8, #f2dfb9);
        }

        .menu-ticket-blue {
          background: linear-gradient(180deg, #91e6ff, #4d96ff);
        }

        .menu-ticket-dark {
          background: linear-gradient(180deg, #4c2d50, #211525);
          color: #fff7d8;
        }

        .ticket-kicker {
          display: grid;
          place-items: center;
          width: 2.42rem;
          height: 2.42rem;
          border: .2rem solid currentColor;
          border-radius: 50%;
          font-family: "Monogram", monospace;
          font-size: 1.08rem;
          font-weight: 800;
          line-height: 1;
        }

        .ticket-label {
          font-family: "PressStart2P", monospace;
          font-size: clamp(.67rem, 1.6vw, .88rem);
          line-height: 1.4;
          text-transform: uppercase;
        }

        .ticket-notch {
          width: .82rem;
          height: 2.3rem;
          border-left: .2rem dashed currentColor;
          opacity: .58;
        }

        .studio-mark {
          margin: 1.05rem 0 0;
          color: rgba(53, 24, 39, .7);
          font-family: "Monogram", monospace;
          font-size: 1.05rem;
          text-align: center;
        }

        @keyframes steam-rise {
          0%, 100% { transform: translateY(0) scaleY(.9); opacity: .18; }
          50% { transform: translateY(-1.7rem) scaleY(1.08); opacity: .46; }
        }

        @media (max-width: 900px) {
          .menu-stage {
            grid-template-columns: minmax(4.8rem, .58fr) minmax(17.5rem, 1.34fr) minmax(4.8rem, .58fr);
            gap: .25rem;
            padding: .75rem .8rem;
            align-items: center;
          }

          .character-side {
            height: min(76vh, 27rem);
            min-height: 16rem;
            opacity: .95;
          }

          .chef-side {
            transform: translateX(-2.1rem) translateY(1.4rem) rotate(-5deg);
          }

          .rival-side {
            transform: translateX(2rem) translateY(1.6rem) rotate(5deg);
          }

          .order-board {
            width: min(100%, 26rem);
            padding: .35rem;
          }

          .order-board::before {
            inset: 4.55rem -.1rem .45rem;
            border-width: .25rem;
          }

          .brand-plaque {
            border-width: .25rem;
            border-radius: 1rem;
            padding: .6rem .65rem .75rem;
            box-shadow: 0 .52rem 0 #2c1621, 0 1rem 1.8rem rgba(0,0,0,.24);
          }

          .brand-title {
            font-size: clamp(2.35rem, 9vh, 4rem);
          }

          .brand-subtitle {
            gap: .35rem;
            font-size: clamp(.48rem, 1.5vh, .68rem);
          }

          .special-ticket {
            margin: .78rem auto .62rem;
            padding: .48rem .6rem;
          }

          .special-ticket strong {
            font-size: clamp(.45rem, 1.45vh, .58rem);
          }

          .menu-actions {
            gap: .45rem;
            width: min(100%, 20.5rem);
          }

          .menu-ticket {
            grid-template-columns: 2.55rem 1fr 1rem;
            min-height: 3.1rem;
            border-width: .19rem;
            border-radius: .58rem;
            box-shadow: .22rem .25rem 0 #2c1621;
          }

          .ticket-kicker {
            width: 2rem;
            height: 2rem;
            font-size: .88rem;
            border-width: .16rem;
          }

          .ticket-label {
            font-size: clamp(.5rem, 1.9vh, .68rem);
          }

          .studio-mark,
          .prop-ticket,
          .prop-tomato {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .menu-stage {
            grid-template-columns: .34fr 1.55fr .34fr;
            padding-inline: .45rem;
          }

          .character-side {
            opacity: .74;
          }

          .chef-side {
            transform: translateX(-4.1rem) translateY(1.8rem) rotate(-7deg);
          }

          .rival-side {
            transform: translateX(4rem) translateY(1.8rem) rotate(7deg);
          }

          .prop-pan,
          .prop-knife,
          .steam {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .steam {
            animation: none;
          }

          .menu-ticket {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
