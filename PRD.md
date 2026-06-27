# 🥊 PRODUCT REQUIREMENTS DOCUMENT
# **BRAWL BUDDIES: CHAOS KITCHEN**
> *"Cook or Get Cooked!"*

---

## 📋 Executive Summary

| Field | Detail |
|---|---|
| **Game Title** | Brawl Buddies: Chaos Kitchen |
| **Genre** | Action / Beat 'em up (2.5D Side-Scrolling) |
| **Platform** | Web Browser (Desktop & Mobile) |
| **Visual Style** | Whimsical, Vibrant, & Cartoony (Colorful, Silly) |
| **Target Audience** | Ages 13–35, casual to semi-competitive brawlers |
| **Game Modes** | Single Player + Online Co-op (2 Players) |
| **Tech Stack** | React + Vite (Front-End) · Node.js + Express/Socket.io (Back-End) |

---

## 🎯 Game Vision & Concept

### The One-Sentence Pitch
> Imagine **Scott Pilgrim vs. The World** crashing headfirst into **Overcooked**—where you beat down rogue kitchen staff while whipping up cosmic dishes in a restaurant suspended in the clouds[cite: 1].

### The Lore / Premise
You are a **Cartoon Culinary Master** running a legendary floating restaurant in the sky[cite: 1]. Out of nowhere, your bitter business rival—**Chef Big Evil Bowl**—deploys an army of rogue robo-cooks to trash your diner and plunder your secret recipes[cite: 1]. 

Your mission? Kick their metal butts while keeping the orders rolling! Defeated enemies drop **gourmet ingredients** that you can toss into your emergency stove to cook up insane, game-changing power-ups[cite: 1]. 

---

## 🎮 Gameplay Overview

### The Core Loop
Enter Stage → Brawl Enemies → Harvest Ingredients → Cook at the Stove → Unleash Power-ups → Obliterate Bosses → Next Level

### Three Pillars of Gameplay

#### 1. 🥊 BREAD-AND-BUTTER COMBAT
* **Light Attack** → Rapid-fire jabs (up to a 5x combo chain)[cite: 1].
* **Heavy Attack** → Slow, devastating strikes that send enemies flying[cite: 1].
* **Grab & Throw** → Lift groggy enemies and hurl them into oncoming crowds like a bowling ball[cite: 1].
* **Culinary Specials (Weaponized Cooking)**[cite: 1]:
    * *Frying Pan* → A heavy "CLANG!" that leaves enemies dazed with spinning stars[cite: 1].
    * *Giant Ladle* → A ground slam that splatters hot sauce, burning nearby foes[cite: 1].
    * *Rolling Pin* → Flattens enemies into pancakes with hilarious bouncing physics[cite: 1].
* **Air Juggle** → Launch enemies skyward and keep the combo alive in mid-air[cite: 1].

#### 2. 🍳 THE CHAOS KITCHEN SYSTEM
Defeated enemies drop premium ingredients like 🍅 Tomatoes, 🧅 Onions, 🍗 Chicken, and 🌶️ Chilies[cite: 1]. Toss them into the **Emergency Stove** scattered across the arena to activate temporary, high-octane buffs[cite: 1]:

| Ingredient 1 | Ingredient 2 | Dish Created | Combat Power-Up |
|---|---|---|---|
| 🍗 Chicken | 🌶️ Chili | **Fiery Smash Chicken** | +50% Damage; fists literally catch fire[cite: 1]. |
| 🍅 Tomato | 🧅 Onion | **Super Hot Salsa** | Punches trigger explosive AoE shockwaves[cite: 1]. |
| 🍳 Egg | 🧀 Cheese | **Shielding Omelette** | Instantly restores HP + grants a mini shield[cite: 1]. |
| 🍌 Banana | 🍦 Ice Cream | **Blizzard Split** | Freezes enemies solid when thrown[cite: 1]. |
| All Ingredients | ??? | **COSMIC FRIED RICE** | **ULTRA MODE (10s):** 3x damage, insane speed, total invincibility[cite: 1]. |

#### 3. ⭐ STYLE, SCORING & COMBOS
* **Combo Multiplier** → Chaining hits scales your multiplier from x1 up to **FRENZY x5!**[cite: 1]
* **Multitasker Bonus** → Awarded for cooking a dish while actively dodging or fighting enemies[cite: 1].
* **"Untouched Chef" Badge** → Earned by clearing an entire level without taking a single hit[cite: 1].

---

## 👤 Playable Roster

### The Starter Trio

#### 🍜 MIMI — The Noodle Master
* **Playstyle:** Ultra-agile, lightning-fast, high combo potential[cite: 1].
* **Weapon:** Elastic, whip-like giant noodles[cite: 1].
* **Special Skill:** *"Noodle Whirlwind"* — Spins like a top, pulling in and blasting away all surrounding enemies[cite: 1].
* **Stats:** Speed ⭐⭐⭐⭐⭐ | Power ⭐⭐ | Defense ⭐⭐[cite: 1]
* **Personality:** Bubbly, talkative, endlessly hungry, and chaotic[cite: 1].

#### 🥩 BOBO — The Grill King
* **Playstyle:** Slow, heavy-hitting juggernaut (The Tank)[cite: 1].
* **Weapon:** A massive BBQ fork and a solid cast-iron griddle[cite: 1].
* **Special Skill:** *"MEGA SEAR!"* — Leaps high and slams the ground, sending a wave of fire in all directions[cite: 1].
* **Stats:** Speed ⭐⭐ | Power ⭐⭐⭐⭐⭐ | Defense ⭐⭐⭐⭐[cite: 1]
* **Personality:** Stoic but hilarious, stone-faced, relies heavily on his catchphrase: *"Delicious."*[cite: 1]

#### 🍰 LALA — The Pastry Puncher
* **Playstyle:** Mid-range zoner with explosive projectiles[cite: 1].
* **Weapon:** Frosted tarts and a dual-wielded heavy frosting gun[cite: 1].
* **Special Skill:** *"Sweet Barrage"* — Fires a salvo of homing mini-cupcakes that explode into colorful, blinding confetti[cite: 1].
* **Stats:** Speed ⭐⭐⭐ | Power ⭐⭐⭐ | Defense ⭐⭐⭐[cite: 1]
* **Personality:** Exceptionally cute on the outside, surprisingly brutal on the inside[cite: 1]. *Quote: "Do you want your frosting PINK or BLOOD RED?"*[cite: 1]

### Secret Unlockable Chefs (Post-Launch)
* 🦐 **SHRIMP-MAN** — A hyper-fast martial artist specializing in rapid-fire tail-swipes[cite: 1].
* 🌶️ **CHEF HABANERO** — A fiery brawler whose every attack leaves a trail of burning embers[cite: 1].

---

## 🗺️ World & Level Design

### World 1: SKY KITCHEN (The Warm-up)
* **Aesthetic:** A whimsical restaurant floating amidst pastel blue and cotton-candy clouds[cite: 1].
* **Enemies:** Rookie robo-cooks sporting oversized, floppy chef hats[cite: 1].
* **Stage Gimmick:** A fast-moving giant conveyor belt floor that messes with player positioning[cite: 1].
* **Boss:** **Chef Micro Bot** — Tiny, annoyingly fast, and loves hiding inside a giant soup pot[cite: 1].

### World 2: SUPERMARKET SWEEP
* **Aesthetic:** A massive grocery store where aisles are collapsing and chaos reigns[cite: 1].
* **Enemies:** Mind-controlled sentient produce (spear-wielding carrots, crying onions)[cite: 1].
* **Stage Gimmick:** Stray shopping carts that players can hijack to run over enemies[cite: 1].
* **Boss:** **The Mutant Cashier** — Uses barcode scanners as deadly lasers and hurls heavy groceries[cite: 1].

### World 3: MIDNIGHT FOOD FESTIVAL
* **Aesthetic:** Vibrant night market packed with neon signs, paper lanterns, and gorgeous bokeh[cite: 1].
* **Enemies:** Evil street food vendors weaponizing motorized food carts[cite: 1].
* **Stage Gimmick:** Volatile gas stoves scattered around the arena that explode when struck[cite: 1].
* **Boss:** **The Foodie MC Duo** — A tag-team boss (one huge brute, one tiny planner) throwing weapons to each other[cite: 1].

### World 4: PALACE OF THE EVIL BOWL (The Grand Finale)
* **Aesthetic:** Gothic fortress constructed entirely out of absurd dark pastries and soup moats[cite: 1].
* **Enemies:** Elite Guards clad in pressure-cooker helmets and cake-pan armor[cite: 1].
* **Stage Gimmick:** Shifting gravity zones where enemies drop down from the ceiling[cite: 1].
* **Boss:** **Chef Big Evil Bowl** — A multi-phase showdown featuring 3 increasingly ridiculous transformations[cite: 1].

---

## 👾 Enemy Ecosystem

### Grunt Types & Behaviors

| Enemy Type | Behavior Pattern | Best Counter-Strategy |
|---|---|---|
| **Line Cook** | Marches forward, basic single punches | 3 quick Light Attacks[cite: 1] |
| **Sous Chef** | Heavily armored, immune to regular hitstun | Heavy Attack to stagger, then Grab[cite: 1] |
| **Drone Waiter** | Hovers overhead, drops spoiled ingredients | Air Juggles or projectile attacks[cite: 1] |
| **Shield Cook** | Blocks all frontal attacks with a wok | Flank from behind or use a Culinary Special[cite: 1] |
| **Bomb Appetit** | Sprints toward players and self-detonates | Grab and throw into other enemies before fuse ends[cite: 1] |
| **Mini-Boss** | Spawns every 3 stages, massive health pool | Learn attack tells, exploit elemental dishes[cite: 1] |

### Stagger & Double-Team Mechanics
* Enemies have a **stagger threshold**[cite: 1]. Depleting this rapidly causes them to dizzily wobble with cartoon stars spinning around their heads[cite: 1].
* Staggered enemies are completely vulnerable to **Grabs**, **Culinary Specials**, or high-damage **Co-op Team Attacks**[cite: 1].

---

## 🌐 Technical Architecture

### The Tech Stack
┌─────────────────────────────────────────────┐
│              FRONT-END (Browser)             │
│                                             │
│  React + Vite   →   UI Layer & HUD Override │
│  Phaser 3       →   Game Engine (Canvas)    │
│  Socket.io-client → Real-time Co-op Sync    │
│  Zustand        →   Global State Management │
│  Howler.js      →   Dynamic Audio Engine    │
└─────────────────────────────────────────────┘
↕ WebSocket / REST APIs
┌─────────────────────────────────────────────┐
│              BACK-END (Server)               │
│                                             │
│  Node.js + Express  →  REST Services         │
│  Socket.io          →  Matchmaking & Sync   │
│  Redis              →  Session & Live Leaderboards│
│  MySQL              →  Persistent Player Data│
└─────────────────────────────────────────────┘


### Game Engine Strategy: **Phaser 3 + React**
* Phaser 3 handles the heavy lifting: physics, collision maps, and sprite animations, completely encapsulated within a React wrapper (`<div id="game-canvas">`)[cite: 1].
* React elegantly handles menus, HUD overlays, text popups, and community leaderboards[cite: 1].
* **Target Performance:** Silky smooth **60 FPS** across modern mobile and desktop browsers via lightweight 2.5D parallax asset optimization[cite: 1].

### Multiplayer Co-op Sync
* Powered by **Socket.io** for lag-compensated positioning, combat events, and ingredient sharing[cite: 1].
* Features a **30-second Graceful Reconnection Window** to prevent game-breaking drops[cite: 1].
* Instant action via **"Generate Invite Link"** (no tedious signup required)[cite: 1].

---

## 📁 Project Directory Structure

brawl-buddies/
│
├── brawl-frontend/               (React + Vite · Game Client)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx              (React Entry Point)
│       ├── App.jsx               (Main Router)
│       │
│       ├── game/                 (Phaser 3 — Game Engine)
│       │   ├── PhaserGame.jsx    (Phaser Wrapper in React)
│       │   ├── config.js         (Phaser Config: resolution, physics, etc)
│       │   ├── scenes/
│       │   │   ├── BootScene.js
│       │   │   ├── PreloadScene.js
│       │   │   ├── MainMenuScene.js
│       │   │   ├── CharacterSelectScene.js
│       │   │   ├── GameScene.js
│       │   │   ├── BossScene.js
│       │   │   └── GameOverScene.js
│       │   ├── entities/
│       │   │   ├── Player.js
│       │   │   ├── characters/
│       │   │   │   ├── Mimi.js
│       │   │   │   ├── Bobo.js
│       │   │   │   └── Lala.js
│       │   │   └── enemies/
│       │   │       ├── BaseEnemy.js
│       │   │       ├── KokiBiasa.js
│       │   │       ├── KokiBesar.js
│       │   │       ├── KokiBom.js
│       │   │       └── bosses/
│       │   │           ├── ChefRobotMicro.js
│       │   │           ├── KasirMutan.js
│       │   │           ├── DuoMCMakan.js
│       │   │           └── ChefBesarMangkukJahat.js
│       │   ├── systems/
│       │   │   ├── CombatSystem.js
│       │   │   ├── CookingSystem.js
│       │   │   ├── ComboSystem.js
│       │   │   └── PowerUpSystem.js
│       │   ├── levels/
│       │   │   ├── World1.js
│       │   │   ├── World2.js
│       │   │   ├── World3.js
│       │   │   └── World4.js
│       │   └── utils/
│       │       ├── AnimationHelper.js
│       │       └── AudioManager.js
│       │
│       ├── components/           (React UI — Canvas Overlay)
│       │   ├── HUD/
│       │   │   ├── HUD.jsx
│       │   │   ├── HealthBar.jsx
│       │   │   ├── ComboCounter.jsx
│       │   │   └── IngredientSlot.jsx
│       │   ├── Menu/
│       │   │   ├── MainMenu.jsx
│       │   │   ├── PauseMenu.jsx
│       │   │   └── CharacterCard.jsx
│       │   ├── Leaderboard/
│       │   │   └── Leaderboard.jsx
│       │   └── common/
│       │       ├── Button.jsx
│       │       └── Modal.jsx
│       │
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── GamePage.jsx
│       │   ├── LeaderboardPage.jsx
│       │   └── ProfilePage.jsx
│       │
│       ├── store/                (Zustand — Global State)
│       │   ├── useGameStore.js
│       │   ├── usePlayerStore.js
│       │   └── useAchievementStore.js
│       │
│       ├── hooks/
│       │   ├── useSocket.js
│       │   └── useSaveData.js
│       │
│       └── assets/
│           ├── sprites/
│           │   ├── characters/
│           │   └── enemies/
│           ├── backgrounds/
│           ├── audio/
│           │   ├── bgm/
│           │   └── sfx/
│           └── ui/
│
└── brawl-backend/                (Node.js + Express · Game Server)
├── package.json
├── server.js                 (Entry Point — Init Express + Socket.io)
├── .env.example
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── playerController.js
│   │   ├── leaderboardController.js
│   │   └── achievementController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── playerRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   └── achievementRoutes.js
│   │
│   ├── sockets/              (Socket.io — Real-time Co-op)
│   │   ├── coopHandler.js    (Sync positioning, inputs, and events)
│   │   └── roomManager.js    (Room matchmaking engine)
│   │
│   ├── models/               (Database Schema — MySQL)
│   │   ├── User.js
│   │   ├── PlayerProgress.js
│   │   ├── Score.js
│   │   └── Achievement.js
│   │
│   ├── middleware/
│   │   ├── auth.js           (JWT Verification)
│   │   └── rateLimit.js
│   │
│   └── utils/
│       ├── redis.js          (Redis Client — Leaderboard & sessions)
│       └── logger.js
│
└── config/
├── db.js                 (MySQL Connection)
├── redis.js              (Redis Config)
└── socket.js             (Socket.io Server Setup)


---

## 📊 Player Progression & Economy

### Experience & Unlockables
* Players earn XP based on score, max combo length, and dishes cooked[cite: 1].
* Leveling up unlocks crazy cosmetic aprons, weapon skins, and flashy hit-text effects[cite: 1].

### Leaderboards (Redis-Powered)
* **Daily Specials** — Tracks the top 10 highest scores globally per stage[cite: 1].
* **Combo Overlord** — Displays the longest unbroken combo streaks[cite: 1].

### Achievements (30+ Badges of Honor)
* 🏆 **Masterchef** — Cook every single recipe combination in the game[cite: 1].
* 🥊 **No Pain, No Grain** — Clear a world without cooking any healing item[cite: 1].
* 🤣 **Cosmic Awakening** — Trigger the Cosmic Fried Rice ultimate 5 times in a single run[cite: 1].

---

## 🎨 Visual & Audio Direction

### Art Direction
* **Inspirations:** *Cuphead* (squash-and-stretch animation fluidity) mixed with *Cartoon Network* golden era aesthetics (bold outlines, punchy primary colors)[cite: 1].
* **Visual Flair:** Optional comic-style text popups ("POW!", "CLANG!", "SIZZLE!") exploding onto the screen during combat[cite: 1].

### Soundscape & Voiceovers
* **BGM:** Energetic jazz-funk fused with traditional Indonesian instruments (Gamelan grooves meet slap bass) to create a frantic kitchen rhythm[cite: 1].
* **SFX:** Highly exaggerated cinematic hits—crunchy slaps, metallic pan clangs, and sizzling grease[cite: 1].
* **Voice Lines:** Character outbursts are short, expressive, and packed with personality (using localized humor)[cite: 1]:
    * Mimi: *"Haiyaaah!", "Want some more?!", "I'm starving!"*[cite: 1]
    * Bobo: *"Delicious.", "Hmmph.", "Get out of my kitchen!"*[cite: 1]
    * Lala: *"Kawaii PUNCH!", "Say cheese!"*[cite: 1]

---

## 📱 UI/UX Design

### HUD Overlay (In-Game)
[♥♥♥♥♥]  MIMI          COMBO x3!        BOBO  [♥♥♥♥♥]
[Energy Bar]   [SCORE: 12,450]  [Energy Bar]

[🍅][🌶️][  ]          WORLD 2-3         [  ][  ][🧅]
Pocket Pouch                           Partner's Pouch


### Interface Highlights
* **Main Menu:** Animated dynamic kitchen backdrop featuring characters causing chaos in the background[cite: 1].
* **Character Select:** Interactive portraits where characters show off moves and play signature audio when selected[cite: 1].
* **Game Over Screen:** Comedic defeat poses with stray kitchen mice coming out to grab leftover food[cite: 1].

---

## ⚠️ Risks & Mitigations

| Risk | Probability | Impact | Mitigation Strategy |
|---|---|---|---|
| Mobile Browser Lag | High | High | Strict canvas profiling; dynamic particle scaling toggles for lower-end devices[cite: 1]. |
| Co-op Network Desync | Medium | Medium | Implement client-side prediction + deterministic server-side step validation[cite: 1]. |
| Scope Creep | High | High | Lock down the core loop first. Move extra worlds/characters to post-launch seasonal updates[cite: 1]. |

---

## 🎉 Success Metrics

* 🎮 **10,000+ Unique Game Sessions** within month one[cite: 1].
* ⏱️ **Average Session Time > 15 Minutes** (indicating strong engagement loops)[cite: 1].
* 👥 **500+ Co-op Rooms Created** weekly[cite: 1].
* ⭐ **4.2+/5 Rating** on platforms like Itch.io or Poki[cite: 1].
* 💬 **The Laugh Test:** If a playtester doesn't crack a smile within the first 3 minutes of gameplay, the animation timing or visual comedy needs to be reworked instantly[cite: 1].

---

## 📎 Appendix

### References & Game Glossary
* **Stagger:** A state where an enemy becomes dazed and perfectly primed for grabs or big combos[cite: 1].
* **Air Juggle:** Launching an enemy into mid-air and unleashing consecutive hits before they touch down[cite: 1].
* **Cosmic Fried Rice:** The ultimate visual and power override triggered by combining rare items[cite: 1].

---

*This PRD is a living document—updated at the end of every development sprint[cite: 1].*
*Version: 1.0.0 | Date: June 2026 | Status: Ready for Production* 🚀[cite: 1]