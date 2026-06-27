# 🥊 PRODUCT REQUIREMENTS DOCUMENT
# **BRAWL BUDDIES: CHAOS KITCHEN**
> *"Masak atau Dipukul!"*

---

## 📋 Ringkasan Eksekutif

| Field | Detail |
|---|---|
| **Nama Game** | Brawl Buddies: Chaos Kitchen |
| **Genre** | Action / Beat 'em up (2.5D Side-Scrolling) |
| **Platform** | Web Browser (Desktop & Mobile) |
| **Gaya Visual** | Lucu & Kartun (Colorful, Silly) |
| **Target Audiens** | 13–35 tahun, kasual hingga semi-kompetitif |
| **Mode** | Single Player + Co-op Online (2 pemain) |
| **Tech Stack** | React + Vite (Front-End) · Node.js + Express/Socket.io (Back-End) |

---

## 🎯 Visi & Konsep Game

### Satu Kalimat Pitch
> Bayangkan **Scott Pilgrim vs The World** bertemu **Overcooked**, di mana kamu memukul musuh sambil memasak hidangan gila di restoran yang kacau balau.

### Premis Cerita
Kamu adalah **Chef Karakter Kartun** yang bekerja di restoran terapung di atas awan. Tiba-tiba, rival bisnis jahat — **Chef Besar Mangkuk Jahat** — mengirim pasukan koki robot nakal untuk merusak restoran dan mencuri resep rahasiamu.

Misimu? Hajar mereka semua sambil tetap melayani pelanggan. Setiap musuh yang dikalahkan menjatuhkan **bahan makanan** yang bisa kamu masak jadi hidangan untuk mendapatkan power-up!

---

## 🎮 Gameplay Overview

### Core Loop (Inti Permainan)
```
Masuki Level → Hajar Musuh → Kumpulkan Bahan → Masak di Kompor → Dapatkan Power-up → Boss Fight → Level Berikutnya
```

### Tiga Pilar Gameplay

#### 1. 🥊 COMBAT (Sistem Pukul-pukulan)
- **Light Attack** → Jab cepat (combo hingga 5x)
- **Heavy Attack** → Serangan lambat tapi melempar musuh
- **Grab & Throw** → Angkat musuh, lempar ke musuh lain seperti bola bowling
- **Cooking Attack (Spesial)** → Gunakan alat masak sebagai senjata:
  - Penggorengan → Pukul "CLANG!" + efek bintang berputar
  - Sendok sayur besar → Slam yang mencipratkan saos ke semua musuh
  - Rolling Pin → Gilas musuh jadi gepeng (animasi lucu, langsung bouncing balik)
- **Air Juggle** → Lempar musuh ke atas, combo di udara

#### 2. 🍳 COOKING SYSTEM (Sistem Masak)
- Musuh yang kalah menjatuhkan bahan: 🍅 Tomat, 🧅 Bawang, 🍗 Ayam, 🌶️ Cabai, dsb.
- Di setiap level ada **Kompor Darurat** di sudut layar
- Masak kombinasi bahan = Power-up Sementara:

| Bahan 1 | Bahan 2 | Masakan | Effect |
|---|---|---|---|
| 🍗 Ayam | 🌶️ Cabai | Ayam Geprek | +50% damage, api keluar dari kepalan |
| 🍅 Tomat | 🧅 Bawang | Sambal | Musuh terkena AOE saat dipukul |
| 🍳 Telur | 🧀 Keju | Omelet | Restore HP + shield kecil |
| 🍌 Pisang | 🍦 Es Krim | Es Pisang | Freeze musuh saat dilempar |
| Semua bahan | ??? | **NASI GORENG KOSMIK** | Ultra mode 10 detik: semua serangan 3x lipat |

#### 3. ⭐ SCORING & COMBO SYSTEM
- Semakin banyak musuh kena dalam satu combo → **Multiplier** naik (x1 → x2 → x3 → FRENZY x5!)
- Masak sambil musuh masih banyak → **Bonus "Multitasker!"**
- Kalahkan seluruh level tanpa kena pukulan → **"Untouched Chef" Badge**

---

## 👤 Karakter Playable

### Starter Characters (3 Karakter)

#### 🍜 MIMI — The Noodle Master
- **Gaya bertarung:** Agile, cepat, combo panjang
- **Senjata:** Mie raksasa seperti cambuk
- **Special:** "Noodle Whirlwind" — Berputar seperti gasing, semua musuh sekitar terpental
- **Stats:** Speed ⭐⭐⭐⭐⭐ | Power ⭐⭐ | Defense ⭐⭐
- **Personality:** Ceria, banyak ngomong, selalu lapar

#### 🥩 BOBO — The Grill King
- **Gaya bertarung:** Lambat, heavy-hitter, tank
- **Senjata:** Garpu BBQ raksasa dan loyang besi
- **Special:** "MEGA BAKAR!" — Loncat dan slam ke tanah, api tersebar ke semua arah
- **Stats:** Speed ⭐⭐ | Power ⭐⭐⭐⭐⭐ | Defense ⭐⭐⭐⭐
- **Personality:** Diam tapi kocak, ekspresi batu, tapi suka bilang "Maknyus."

#### 🍰 LALA — The Pastry Puncher
- **Gaya bertarung:** Mid-range, banyak projectile
- **Senjata:** Kue tart dan frosting gun
- **Special:** "Sweet Barrage" — Tembak salvo kue mini yang meledak warna-warni
- **Stats:** Speed ⭐⭐⭐ | Power ⭐⭐⭐ | Defense ⭐⭐⭐
- **Personality:** Imut di luar, brutal di dalam. Quote: "Kamu mau frosting PINK atau MERAH?"

### Unlock Characters (Later)
- 🦐 **UDANGMAN** — Power-up dari balik layar, combo super cepat
- 🌶️ **CHEF CABAI** — Seluruh serangan berbasis api, musuh takut mendekat

---

## 🗺️ Level Design

### World 1: DAPUR LANGIT (Tutorial + Normal)
**Latar:** Restoran terapung di atas awan pastel biru & putih
**Tema Musuh:** Koki robot pemula dengan topi chef kecil
**Gimmick Level:** Lantai bergerak di atas konveyor raksasa
**Boss:** **Chef Robot Micro** — Kecil, tapi super cepat, sering bersembunyi dalam panci

### World 2: PASAR SWALAYAN KACAU
**Latar:** Supermarket raksasa yang rak-raknya berjatuhan
**Tema Musuh:** Sayuran dan buah yang sudah "diprogram jahat" (wortel bersenjata tombak, bawang yang bikin nangis)
**Gimmick Level:** Keranjang belanja bisa dikendarai dan ditabrakkan ke musuh
**Boss:** **Kasir Mutan** — Scan barcode yang jadi laser, lempar belanjaan ke pemain

### World 3: FESTIVAL MAKANAN MALAM
**Latar:** Street food festival malam hari, warna neon, lampion, efek bokeh
**Tema Musuh:** Penjual makanan jahat dengan gerobak senjata
**Gimmick Level:** Kompor-kompor di arena bisa diledakkan jika diserang
**Boss:** **Duo MC Makan** — Dua boss sekaligus, satu besar satu kecil, saling oper senjata

### World 4: ISTANA MANGKUK JAHAT (Final World)
**Latar:** Istana gothic tapi dengan dekorasi makanan absurd (menara berbentuk cake, kolam sup)
**Tema Musuh:** Elite Guard dengan armor dari loyang dan helm panci pressure cooker
**Gimmick Level:** Gravitasi berubah-ubah, musuh bisa menyerang dari langit-langit
**Boss:** **Chef Besar Mangkuk Jahat** — Multi-phase, 3 fase transformasi, makin absurd tiap fase

---

## 👾 Sistem Musuh

### Tipe Musuh

| Tipe | Perilaku | Cara Kalahkan |
|---|---|---|
| **Koki Biasa** | Jalan lurus, pukul sederhana | 3 pukulan ringan |
| **Koki Besar** | Lambat, butuh heavy attack untuk stagger | Grab & throw, atau 2x heavy |
| **Koki Terbang** | Hover di atas, lempar bahan busuk | Air combo atau projectile |
| **Koki Pelindung** | Pakai perisai wajan | Grab dari belakang, atau cooking attack |
| **Koki Bom** | Mengejar pemain, meledak jika didekati | Lempar ke musuh lain sebelum meledak |
| **Mini Boss** | Muncul tiap 3 level, punya HP bar | Pelajari pola, eksploitasi kelemahan elemen |

### Sistem Stagger & Reaction
- Setiap musuh punya **stagger threshold** — jika HP turun cepat, mereka sempoyongan (animasi lucu: bintang berputar di kepala)
- Saat stagger: bisa di-**grab**, **cooking combo**, atau **double team** (jika co-op)

---

## 🌐 Arsitektur Teknis

### Tech Stack Detail

```
┌─────────────────────────────────────────────┐
│              FRONT-END (Browser)             │
│                                             │
│  React + Vite   →   Game UI & HUD          │
│  Phaser 3       →   Game Engine (Canvas)   │
│  Socket.io-client → Co-op Realtime         │
│  Zustand        →   State Management       │
│  Howler.js      →   Audio                  │
└─────────────────────────────────────────────┘
              ↕ WebSocket / REST
┌─────────────────────────────────────────────┐
│              BACK-END (Server)               │
│                                             │
│  Node.js + Express  →  REST API            │
│  Socket.io          →  Co-op Sync          │
│  Redis              →  Session & Leaderboard│
│  MySQL              →  Save Data, Accounts │
└─────────────────────────────────────────────┘
```

### Game Engine Choice: **Phaser 3**
- Embedded di dalam React component (`<div id="game-canvas">`)
- Handle semua physics, sprite animation, collision detection
- React mengelola: Menu, HUD overlay, pause screen, leaderboard

### Rendering Strategy
- **2.5D Side-Scrolling** dengan parallax background (3 layer: langit, mid, depan)
- Sprite sheet: 128x128px per frame, atlased per karakter
- Target: **60 FPS** di browser modern

### Co-op Online (2 Player)
- **Socket.io** untuk sinkronisasi posisi, input, dan event
- Server-side: validasi state game (anti-cheat sederhana)
- Jika koneksi terputus: auto-pause + reconnect window 30 detik
- Mode: **Invite Link** (tanpa akun) atau **Friend System** (dengan akun)

### Save System
- **Guest Mode:** Data tersimpan di `localStorage` + cookie
- **Logged In:** Sync ke MySQL (progress, score, karakter unlock)
- Auto-save setelah setiap level selesai

---

## 📁 Struktur Folder Proyek

```
brawl-buddies/
│
├── brawl-frontend/               (React + Vite · Game Client)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx              (Entry point React)
│       ├── App.jsx               (Router utama)
│       │
│       ├── game/                 (Phaser 3 — Game Engine)
│       │   ├── PhaserGame.jsx    (Wrapper Phaser di dalam React)
│       │   ├── config.js         (Konfigurasi Phaser: resolusi, physics, dll)
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
│       ├── components/           (UI React — Overlay di atas canvas)
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
│       ├── store/                (Zustand — State Global)
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
    ├── server.js                 (Entry point — init Express + Socket.io)
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
    │   ├── sockets/              (Socket.io — Co-op Realtime)
    │   │   ├── coopHandler.js    (Sync posisi, input, event pemain)
    │   │   └── roomManager.js    (Buat & kelola game room)
    │   │
    │   ├── models/               (Schema Database — MySQL)
    │   │   ├── User.js
    │   │   ├── PlayerProgress.js
    │   │   ├── Score.js
    │   │   └── Achievement.js
    │   │
    │   ├── middleware/
    │   │   ├── auth.js           (JWT verification)
    │   │   └── rateLimit.js
    │   │
    │   └── utils/
    │       ├── redis.js          (Redis client — leaderboard & session)
    │       └── logger.js
    │
    └── config/
        ├── db.js                 (Koneksi MySQL)
        ├── redis.js              (Konfigurasi Redis)
        └── socket.js             (Setup Socket.io server)
```

---

## 📊 Progression System

### XP & Level Up
- Setiap pertarungan memberikan XP berdasarkan: combo tertinggi, waktu, bahan dimasak
- Level up membuka: kostum baru, efek visual serangan, title unik

### Leaderboard (Redis-backed)
- **Daily Score Board** — Top 10 score harian per world
- **Combo Leaderboard** — Siapa yang dapat combo terpanjang
- Real-time update, nama player muncul di papan dalam game (easter egg: papan di dalam dapur)

### Achievement System (30+ Achievement)
Contoh:
- 🏆 **"Masterchef"** — Masak semua kombinasi masakan
- 🥊 **"No Pain No Gain"** — Selesaikan level tanpa heal
- 🤣 **"Nasi Goreng Kosmik"** — Aktifkan power-up ultimate 5x
- 👨‍🍳 **"Solo Meal"** — Kalahkan boss sendirian tanpa co-op
- 💨 **"Sonic Delivery"** — Selesaikan World 1 dalam 5 menit

---

## 🎨 Visual & Audio Direction

### Art Style
- **Inspirasi:** Cuphead (fluid animation) + Cartoon Network (expressive, flat color)
- **Palet Warna:** Bold primaries (merah, kuning, biru), outline hitam tebal
- **Resolusi Dasar:** 1280x720 (scalable hingga 1920x1080)
- **Efek Komik:** "BIFF!", "WHAM!", "SPLAT!" text pop-up saat hit (optional toggle)

### Animasi Prinsip
- Setiap karakter punya minimum **12 animasi state**: idle, walk, jump, attack1-5, hurt, knockdown, get-up, victory, lose
- **Squash & Stretch** digunakan di semua hit reaction
- Enemy death: animasi lucu (koki robot meledak jadi confetti, bawang menangis sampai meleleh, dll)

### Audio Direction
- **BGM:** Jazz funk upbeat dengan elemen gamelan/tradisional Indonesia (world fusion)
- **SFX:** Over-the-top exaggerated hits — BONK, SPLAT, SIZZLE
- **Voice Acting:** Karakter berteriak kata-kata absurd pendek (Bahasa Indonesia campur Jawa):
  - Mimi: *"Haiyaaah!", "Minta lagi?!", "Aku lapar BANGEEET!"*
  - Bobo: *"Maknyus.", "Hmmm.", "Ngopo koe?!"*
  - Lala: *"Kawaii PUNCH!", "Mau frosting-nya?"*

---

## 📱 UI/UX Design

### HUD (In-Game)
```
[♥♥♥♥♥]  MIMI          COMBO x3!        BOBO  [♥♥♥♥♥]
[====Energy Bar====]   [SCORE: 12,450]  [====Energy Bar====]

[🍅][🌶️][  ]          WORLD 2-3         [  ][  ][🧅]
 Bahan di kantong                        Bahan partner
```

### Layar Utama
- **Main Menu:** Animasi background dapur yang hidup, karakter berlari-lari di background
- **Character Select:** Animasi karakter memperagakan jurus, suara voice line saat dipilih
- **Pause Menu:** Overlay dengan efek "game ditempel stiker" — lucu, tidak keluar dari vibe
- **Game Over Screen:** Karakter jatuh lucu, tikus dapur muncul makan sisa makanan di sekitar

### Responsive Design
- Desktop: keyboard + gamepad support
- Mobile: Virtual D-pad + 3 tombol aksi (Light, Heavy, Special)
- Tablet: sama seperti mobile, tapi HUD lebih besar

---

## ⚠️ Risiko & Mitigasi

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Performa di browser mobile buruk | Tinggi | Tinggi | Profiling awal dengan Phaser debug tools, kurangi particle effect di mobile |
| Latensi co-op online | Sedang | Sedang | Gunakan delta-time sync + client-side prediction |
| Scope creep (fitur kebanyakan) | Tinggi | Tinggi | Prioritaskan fun core loop, fitur lain di post-launch |
| Art asset terlambat | Sedang | Tinggi | Gunakan placeholder art dari itch.io dulu, replace iteratif |
| Pemain bosan cepat | Sedang | Tinggi | Playtest per level setiap sprint, iterasi berdasarkan feedback |

---

## 🎉 Success Metrics

### Launch Targets (3 Bulan Setelah Rilis)
- 🎮 **10,000 game sessions** pertama
- ⏱️ **Average session time > 15 menit**
- 👥 **500 co-op sessions** per minggu
- ⭐ **4.2+/5** rating di itch.io / platform distribusi
- 🏆 **1,000 achievement** terbuka (indikator engagement)

### Fun Metric (paling penting!)
> *"Apakah pemain tertawa minimal sekali dalam 5 menit pertama?"*
> Tes ini dilakukan di setiap playtest. Jika tidak, artinya ada yang salah dengan comedy timing atau animasi.

---

## 📎 Appendix

### Referensi & Inspirasi
- **Scott Pilgrim vs The World: The Game** — Combat feel & combo system
- **River City Girls** — Character personality & humor style
- **Overcooked 2** — Cooking chaos concept
- **Cuphead** — Art direction & animation quality target
- **Castle Crashers** — Co-op beat 'em up loop
- **Oishi High School Battle** — Local indie beat 'em up sebagai benchmark scope

### Kosakata Game
- **Stagger:** Kondisi musuh sempoyongan, rentan di-grab
- **Air Juggle:** Combo di udara setelah musuh di-launch ke atas
- **Cooking Combo:** Serangan yang menggunakan alat masak sebagai senjata
- **FRENZY Mode:** Status saat multiplier combo mencapai x5
- **Nasi Goreng Kosmik:** Ultimate power-up dari masak semua bahan

---

*PRD ini bersifat living document — update setiap akhir sprint.*
*Versi: 1.0.0 | Tanggal: Juni 2026 | Status: Ready for Development* 🚀
