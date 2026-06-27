# 🥊 Brawl Buddies: Chaos Kitchen

Beat 'em up 2.5D kartun — *"Masak atau Dipukul!"*. Implementasi dari [PRD.md](../PRD.md).

> **Stack:** React + Vite + Phaser 3 (TypeScript) · Node.js + Express + Socket.io (JavaScript) · Redis · MySQL

## 📁 Struktur

```
brawl-buddies/
├── brawl-frontend/   # Game client (React + Phaser 3, TypeScript)
└── brawl-backend/    # Game server (Express + Socket.io, JavaScript)
```

## 🚀 Cara Menjalankan

### 1. Frontend (game client)
```bash
cd brawl-frontend
npm install
npm run dev          # buka http://localhost:5173
```
Game langsung playable tanpa backend (skor tersimpan di localStorage).

### 2. Backend (opsional — leaderboard & co-op)
```bash
cd brawl-backend
cp .env.example .env # sesuaikan kredensial MySQL/Redis
npm install
npm run dev          # http://localhost:4000
```
> MySQL & Redis bersifat **best-effort**: server tetap hidup walau keduanya belum terpasang. Leaderboard otomatis fallback ke penyimpanan lokal.

## 🎮 Kontrol

| Tombol | Aksi |
|---|---|
| `W A S D` | Gerak 8 arah |
| `J` | Light attack |
| `K` | Heavy attack |
| `L` | Special (butuh energy penuh) |
| `E` | Masak (dekat kompor) |
| `Esc` | Pause (benar-benar freeze scene) |

> 📱 **Mobile:** di perangkat sentuh otomatis muncul **joystick** (gerak) + tombol **J/K/L/E** & jeda di layar.

## 🧩 Status Implementasi

**✅ Sudah jalan (boilerplate playable):**
- `npm run build` lolos (tsc + vite) — config TypeScript/Vite sudah benar
- Alur scene: Boot → Preload → Menu → Character Select → Game → Boss → Game Over
- 3 karakter (Mimi/Bobo/Lala) dengan stat berbeda
- Combat (light/heavy/special), combo & multiplier (x1→FRENZY x5)
- Cooking system + 5 resep power-up — Nasi Goreng Kosmik dapat tercapai (4 slot bahan)
- Musuh (Koki Biasa/Besar/Bom) + 4 boss per world, dengan **bar HP melayang** & **telegraph ledakan** bom
- Pause **benar-benar membekukan** scene Phaser (bukan sekadar overlay)
- Kontrol **mobile** (joystick + tombol sentuh) via KeyboardEvent sintetis
- Placeholder visual **readable**: koki bertopi (pemain) vs koki galak (musuh) vs bom bersumbu vs boss bermahkota
- 4 world dengan wave berbeda
- HUD React di atas canvas, Zustand store, persist localStorage
- Backend: REST (auth/player/leaderboard/achievement) + Socket.io co-op skeleton

**🔜 TODO (lihat komentar `// TODO` di kode):**
- Sprite/atlas pixel-art asli (saat ini siluet placeholder yang readable)
- Pola serangan unik tiap boss & fase transformasi
- Grab & throw, air juggle
- Co-op online penuh (client-side prediction)
- Audio (Howler sudah ter-wire, tinggal file)

*Versi: 1.0.0 — scaffold sesuai PRD*
