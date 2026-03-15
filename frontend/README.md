# Robot Arm CV

Real-time arm & hand keypoint detection to control robot arm.  
Built with **Next.js 14 + TypeScript + Tailwind CSS + Docker + Nginx**.

---

## Quick Start

```bash
cp .env.local.example .env.local   # set NEXT_PUBLIC_BACKEND_URL
npm install
npm run dev                         # → http://localhost:3000
```

Make sure your FastAPI backend is running on `http://localhost:8000`.

---

## Docker (production)

```bash
# 1. Edit docker-compose.yml — set your FastAPI image name
# 2. Build and run
docker compose up --build

# Access via Nginx
open http://localhost
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Dashboard page (composes all hooks + components)
│   └── globals.css         # Tailwind + IBM Plex Mono + scanline/noise effects
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Top bar — title, mode badge, status dots
│   │   └── Sidebar.tsx     # Collapsible 272px sidebar
│   ├── stream/
│   │   ├── StreamViewport.tsx  # Outer frame + HUD overlays + backend-offline overlay
│   │   ├── StreamPlayer.tsx    # <img> MJPEG renderer + canvas compositor
│   │   └── KeypointCanvas.tsx  # Canvas: bones + glowing joint dots
│   ├── controls/
│   │   ├── StreamControls.tsx  # URL input, Start/Stop, Raw/AI toggle
│   │   └── StatusPanel.tsx     # Live stat rows + alert banners
│   └── ui/
│       ├── Badge.tsx       # Variant badge pill
│       └── Divider.tsx     # Section divider with optional label
│
├── hooks/
│   ├── useStream.ts        # Stream URL, active state, start/stop
│   ├── useKeypoints.ts     # Polls /keypoints at 50 ms when AI mode active
│   └── useMetadata.ts      # Polls /metadata at 1 s when stream active
│
├── services/
│   └── api.ts              # All fetch calls in one place
│
├── types/
│   └── index.ts            # Shared TypeScript interfaces
│
└── config/
    └── env.ts              # Backend URL, poll intervals, canvas constants, bone pairs
```

---

## Backend API Contracts

| Endpoint     | Method | Description                  |
|-------------|--------|------------------------------|
| `/stream`    | GET    | MJPEG stream                 |
| `/keypoints` | GET    | Keypoints JSON for cur frame |
| `/metadata`  | GET    | FPS, camera status, source   |

### `/keypoints`
```json
{
  "timestamp": 1234567890,
  "fps": 20,
  "keypoints": [
    { "x": 320, "y": 210, "v": 1 },
    { "x": 330, "y": 260, "v": 1 }
  ]
}
```

### `/metadata`
```json
{
  "fps": 20,
  "camera_status": "connected",
  "source": "esp32"
}
```

---

## Configuration

All tunable constants live in `src/config/env.ts`:

| Constant | Default | Description |
|---------|---------|-------------|
| `POLL.keypoints` | `50 ms` | Keypoint fetch interval |
| `POLL.metadata`  | `1000 ms` | Metadata fetch interval |
| `POLL.retry`     | `5000 ms` | Backend-offline retry hint |
| `CANVAS.dotRadius` | `5` | Keypoint dot size |
| `BONE_PAIRS` | Hand skeleton | Bone connections (adjust to your model) |

---

## Customising Keypoint Layout

`BONE_PAIRS` in `src/config/env.ts` defines which keypoint indices connect as bones.  
The default uses a 21-point hand skeleton. Adjust to match your model's output.

---

## Notes

- Stream rendered via `<img src="...">` — works natively with MJPEG.
- Canvas overlay is synced to container size via `ResizeObserver`.
- No global state library — all state via React hooks.
- `next.config.ts` proxies `/api/*` → backend to avoid CORS in dev.
