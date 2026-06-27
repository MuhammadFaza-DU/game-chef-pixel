# 🥊 BRAWL BUDDIES: CHAOS KITCHEN
> **"Cook or Get Cooked!"** 🍳🔥

Welcome to **Brawl Buddies: Chaos Kitchen**—a chaotic, high-energy 2.5D side-scrolling beat 'em up built entirely for the web browser. Imagine **Scott Pilgrim vs. The World** crashing headfirst into **Overcooked**! 

Beat down rogue robo-cooks, harvest fresh ingredients from their mechanical remains, rush to the emergency stove, and cook up game-changing cosmic dishes to unleash absolute culinary devastation!

---

## 🎯 What Makes It Delicious (Core Features)

* **🥊 Punchy Arcade Combat:** Fluid battle loops featuring Light Attacks, Heavy Attacks, Specials, and satisfying screen-shake hit reactions with dynamic combo multipliers.
* **🍳 The Chaos Cooking System:** Turn dropped ingredients into high-octane battle buffs—ranging from fiery damage boosts to the legendary **Cosmic Fried Rice** invincible mode!
* **👤 Unique Playable Roster:** Master three distinct cartoon chefs—Mimi (The Speedster), Bobo (The Heavy Juggernaut), and Lala (The Zoner).
* **🗺️ 4 Worlds of Culinary Madness:** Battle your way through the Sky Kitchen, a chaotic Supermarket Sweep, a neon Midnight Food Festival, and the Palace of the Evil Bowl.
* **⚡ Modern Tech Fusion:** Features a high-performance **Phaser 3 Game Canvas** wrapped in a polished, responsive **React HUD Overlay** with global state powered by Zustand.
* **📱 Play Anywhere:** Native mobile support with automated touch controls and responsive layouts for on-the-go brawling.

---

## 🔁 The Core Gameplay Loop

```text
  ┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
  │ Enter Stage  │ ───> │ Brawl Baddies│ ───> │ Gather Ingredients│
  └──────────────┘      └──────────────┘      └──────────────────┘
                                                        │
  ┌──────────────┐      ┌──────────────┐      ┌─────────┴────────┐
  │ Next World!  │ <─── │ Smash Bosses │ <─── │ Cook Power-Ups!  │
  └──────────────┘      └──────────────┘      └──────────────────┘
Note: The game is fully operational and playable client-side only using browser local storage! The backend server is optional and unlocks enhanced network features like online co-op and global leaderboards.🥋 Playable ChefsChefTitleCombat StyleSignature Move🍜 MimiThe Noodle MasterLightning-fast, high agility, huge combo countsNoodle Whirlwind🥩 BoboThe Grill KingSlow, heavy-hitting, unstoppable tankMega Bakar (Mega Sear)🍰 LalaThe Pastry PuncherBalanced mid-range zoner, sweet but deadlySweet Barrage🕹️ Controls💻 Desktop KeyboardW A S D : Move in 8 directionsJ : Light Attack (Chain up to 5x combo!)K : Heavy Attack (Knockback enemies)L : Culinary Special Attack (Requires full energy meter)E : Cook (Stand near an Emergency Stove)Esc : Pause Game📱 Mobile Touch DevicesThe game automatically detects your mobile browser and projects a virtual joystick and action buttons directly over the screen—no extra configuration required!🌐 Tech StackPlaintext 💻 FRONT-END                        ⚙️ BACK-END (Optional)
 ├─ React 18 & Vite                   ├─ Node.js & Express
 ├─ TypeScript                        ├─ Socket.io (Real-time Co-op)
 ├─ Phaser 3 (2.5D Game Engine)       ├─ MySQL (Persistent Database)
 ├─ Zustand (State Management)        ├─ Redis (High-speed Leaderboards)
 └─ Howler.js (Dynamic Audio)         └─ JWT Authentication
🚀 Getting Started1. Run the Game Client (Front-End)Bash# Navigate to the frontend directory
cd brawl-buddies/brawl-frontend

# Install dependencies
npm install

# Start the local development server
npm run dev
Once started, open your browser and navigate to: http://localhost:51732. Run the Game Server (Optional Back-End)Bash# Navigate to the backend directory
cd brawl-buddies/brawl-backend

# Set up environment variables
cp .env.example .env

# Install dependencies and start development server
npm install
npm run dev
The server will boot up on: http://localhost:4000(Database and Redis services feature resilient, graceful fallbacks—the server stays alive even if they are offline!)🛠️ Project Directory StructurePlaintextbrawl-buddies/
├── brawl-frontend/         # React application housing the Phaser 3 game canvas
└── brawl-backend/          # Node.js backend providing multiplayer syncing and APIs
For detailed breakdowns of core code architecture, system structures, and mechanics, read the full PRD.md.📈 Roadmap & Current Progress✅ Cooked & Ready (Implemented)Full arcade stage progression flows from main menu to game over.Operational combo system with real-time score counters and damage multipliers.Fully simulated physics for standard, armored, and explosive bomb enemies.Cooking stove systems containing 5 unique recipes (including Cosmic Fried Rice mode).Comprehensive Zustand storage syncing with browser localStorage.🍳 Still In the Oven (Planned)Final custom high-fidelity pixel art character assets.Advanced combat mastery mechanics: Grappling, throwing, and aerial juggles.Comprehensive client-predicted multiplayer network synchronization.Extended audio design and cinematic voiceovers.📄 Version & LicenseCurrent Version: 1.0.0 (Playable Scaffold)Developed as a modern web-first indie game prototype.Get your aprons tied, grab your frying pan, and let's start a kitchen riot! 🥊🔥