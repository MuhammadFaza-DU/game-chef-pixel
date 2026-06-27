# Brawl Buddies: Chaos Kitchen

A cartoon 2.5D beat 'em up where chefs brawl, cook, combo, and somehow still try to keep the kitchen alive.

**Tagline:** Cook or get cooked.

Brawl Buddies: Chaos Kitchen mixes arcade brawler combat with chaotic cooking decisions. Knock out enemy chefs, collect the ingredients they drop, run to the emergency stove, and turn the mess into temporary power-ups before the next wave crashes into the kitchen.

## What Makes It Fun

- Fast, readable beat 'em up combat with light attacks, heavy attacks, specials, knockback, hit reactions, and combo multipliers.
- A cooking system that turns dropped ingredients into short-lived power-ups, from damage boosts to healing and the ultimate Cosmic Fried Rice mode.
- Three playable chefs with different personalities and combat styles: Mimi, Bobo, and Lala.
- Four themed worlds with unique waves, backgrounds, bosses, and kitchen-flavored chaos.
- A React HUD layered over a Phaser game canvas, so the game gets arcade energy with modern web UI polish.
- Mobile controls with a virtual joystick and action buttons for touch devices.
- Optional backend support for auth, player progress, leaderboards, achievements, and co-op foundations.

## Gameplay Loop

```text
Enter a level -> Beat enemies -> Collect ingredients -> Cook at the stove -> Gain power-ups -> Fight the boss -> Move to the next world
```

The game is playable without the backend. Scores and progress can fall back to local browser storage, while the backend is available for expanded online systems.

## Playable Characters

| Character | Role | Style | Special |
|---|---|---|---|
| Mimi | The Noodle Master | Fast, agile, long combo chains | Noodle Whirlwind |
| Bobo | The Grill King | Slow, heavy-hitting, durable | Mega Bakar |
| Lala | The Pastry Puncher | Balanced, mid-range pressure | Sweet Barrage |

## Controls

| Input | Action |
|---|---|
| `W A S D` | Move in 8 directions |
| `J` | Light attack |
| `K` | Heavy attack |
| `L` | Special attack, requires full energy |
| `E` | Cook near a stove |
| `Esc` | Pause the game |

On touch devices, the game displays mobile controls automatically.

## Project Structure

```text
brawl-buddies/
  brawl-frontend/   React + Vite + Phaser 3 game client
  brawl-backend/    Node.js + Express + Socket.io game server
```

The repository also includes `PRD.md`, which documents the product vision, systems, technical architecture, roadmap, risks, and success metrics.

## Tech Stack

**Frontend**

- React 18
- Vite
- TypeScript
- Phaser 3
- Zustand
- Howler.js
- Tailwind CSS

**Backend**

- Node.js
- Express
- Socket.io
- MySQL
- Redis
- JWT authentication

## Running the Game Client

```bash
cd brawl-buddies/brawl-frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Running the Optional Backend

```bash
cd brawl-buddies/brawl-backend
cp .env.example .env
npm install
npm run dev
```

Default server URL:

```text
http://localhost:4000
```

MySQL and Redis are best-effort services. The server is designed to keep running even when those services are not available, with local fallback behavior where possible.

## Current Implementation Status

Implemented and playable:

- Complete scene flow: Boot, Preload, Menu, Character Select, Game, Boss, Game Over.
- Three playable characters with different stat profiles.
- Combat with light, heavy, special attacks, combos, and multiplier feedback.
- Cooking system with five power-up recipes, including Cosmic Fried Rice.
- Enemy types: regular chef, heavy chef, bomb chef, and world bosses.
- Floating boss HP bars and bomb explosion telegraphs.
- Real pause behavior that freezes the Phaser scene.
- Mobile virtual controls through synthesized keyboard events.
- Four worlds with distinct wave setups.
- React HUD overlay, Zustand state stores, and localStorage persistence.
- Backend REST endpoints and Socket.io co-op skeleton.

Planned improvements:

- Finalized original pixel-art sprite sheets and atlases.
- More distinct boss attack patterns and transformation phases.
- Grab, throw, and air juggle systems.
- Full online co-op with prediction and reconnect handling.
- Audio polish and final mixing.

## Product Notes

This project started from a full PRD and is built as a web-first indie action game prototype. The current goal is to make the core loop instantly understandable: hit things, grab ingredients, cook something ridiculous, and laugh when the kitchen explodes into points.

See [PRD.md](PRD.md) for the full product direction.

## Version

`1.0.0` - playable scaffold based on the product requirements document.
