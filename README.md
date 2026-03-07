# 🖥 BrowserOS

**A fully-featured desktop operating system that runs entirely in your browser.**

No server required. No frameworks. No dependencies. Just a single HTML file.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎨 **3 Desktop Themes** | Windows 11 
| 📁 **File Manager** | Full CRUD with IndexedDB persistence, drag-and-drop upload |
| 🎵 **Music Player** | Audio file playback, visualizer, playlist, shuffle/repeat |
| 🌐 **Web Browser** | Multi-tab browsing with iframes, quick links, URL bar |
| 📝 **Text Editor** | Create/edit/save/download text files; image viewer |
| ⬛ **Terminal** | 15+ commands: ls, mkdir, theme, calc, whoami, history… |
| ⚙️ **Settings App** | Theme picker, account info, storage stats |
| 👤 **Multi-User** | Account creation with separate IndexedDB databases per user |
| 🔔 **Notifications** | System-level toast notifications |
| 📵 **Offline** | Service Worker caching for offline use |
| 📱 **Responsive** | Works on mobile, tablets, and older low-resource devices |

---

## 🚀 Quick Start

### Option 1 — Open directly
Just open `browseros.html` in any modern browser. No build step, no server needed.

### Option 2 — Serve locally
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```
Then navigate to `http://localhost:8080/browseros.html`

### Option 3 — GitHub Pages
1. Fork this repo
2. Go to Settings → Pages
3. Set source to `main` branch
4. Your OS will be live at `https://yourusername.github.io/browseros/browseros.html`

---

## 🎮 Usage

### Login
- **Demo account:** `guest` / `guest`
- Create your own account with the "Create Account" tab
- Each user gets their own isolated IndexedDB database

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl + Esc` | Toggle Start Menu |
| `Alt + F4` | Close active window |
| `Escape` | Close menus/dialogs |

### Terminal Commands
```
help       — List all commands
ls         — List files in current directory  
mkdir <n>  — Create directory
theme <t>  — Set theme (windows/macos/linux)
calc <exp> — Evaluate math expression
open <app> — Open application (files/music/browser/editor/terminal)
date       — Show current date/time
whoami     — Show current user
history    — Show command history
clear      — Clear terminal
uname      — System info
exit       — Close terminal
```

---

## 🏗 Architecture

```
browseros.html (single file)
├── CSS — Theme system with CSS variables (Windows/macOS/Linux)
├── HTML — Login screen, desktop, taskbar, window shell
└── JavaScript
    ├── DB — IndexedDB wrapper (system DB + per-user DBs)
    ├── Auth — User creation, login, per-user isolation
    ├── OS — Core state, theme management
    ├── Window Manager — Drag, resize, minimize, maximize, z-index
    ├── Apps
    │   ├── File Manager — IndexedDB CRUD, upload, navigate
    │   ├── Music Player — Web Audio, visualizer, playlist
    │   ├── Browser — Multi-tab iframe system
    │   ├── Text Editor — Create/edit/save/download
    │   ├── Terminal — Virtual CLI with 15+ commands
    │   ├── Settings — Theme, account, storage
    │   └── About — System info
    ├── Notifications — Toast system
    └── Service Worker — Offline caching (blob URL injection)
```

---

## 🎨 Theme System

Themes are applied via a `data-theme` attribute on `<body>`:

```css
[data-theme="windows"] { --accent: #0078d4; --radius: 4px; ... }
[data-theme="macos"]   { --accent: #007aff; --radius: 10px; ... }
[data-theme="linux"]   { --accent: #9b59b6; --radius: 6px; ... }
```

Switch themes at runtime:
```javascript
setTheme('macos'); // 'windows' | 'macos' | 'linux'
```

---

## 💾 Storage Model

```
IndexedDB
├── BrowserOS_System          (global)
│   └── users                 { username, password_hash, theme }
└── BrowserOS_User_<name>     (per user)
    ├── files                 { id, name, path, type, data, size, modified }
    ├── music                 { id, name, artist, album, src }
    └── settings              { key, value }
```

---

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 60+ | ✅ Full |
| Firefox 60+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 80+ | ✅ Full |
| Chrome Android | ✅ Full |
| iOS Safari | ⚠️ Partial (no Service Worker) |

Works on devices with as little as **512MB RAM**.

---

## 🔒 Privacy

- **Everything runs locally** — no data is sent to any server
- Passwords are hashed client-side (simple hash — not for production security)
- All files are stored in your browser's IndexedDB
- Clearing browser data will erase all BrowserOS data

---

## 📦 File Uploading

**Files App:** Drag & drop or click "Upload" to add any file type.  
**Music App:** Use "Upload Audio Files" to add MP3, WAV, OGG, FLAC, etc.

Audio files uploaded to the Files app are automatically added to the Music Player.

---

## 🛠 Extending BrowserOS

### Add a new app:
```javascript
// 1. Add to APPS array
const APPS = [
  ...
  { id: 'myapp', name: 'My App', icon: '🚀' },
];

// 2. Add render function
function renderMyapp(body, winId) {
  body.innerHTML = `<div>Hello from My App!</div>`;
}

// 3. Add case to loadAppContent()
case 'myapp': renderMyapp(body, winId); break;
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🤝 Contributing

1. Fork the repo
2. Make changes to `browseros.html`
3. Test across browsers
4. Submit a PR

**Ideas for contributions:**
- [ ] Calculator app
- [ ] Calendar app
- [ ] Paint/drawing app
- [ ] Code editor with syntax highlighting
- [ ] Video player
- [ ] Better password security (bcrypt WASM)
- [ ] WebRTC for multi-device sync
- [ ] More terminal commands
- [ ] Window snapping (Aero Snap style)

---

*Built with ❤️ — one HTML file to rule them all.*
