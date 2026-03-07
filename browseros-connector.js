#!/usr/bin/env node
// ============================================================
//  BrowserOS Native Connector  v3.0
//  Bridges BrowserOS (running in any browser) to real hardware
//  and the local filesystem via WebSocket.
//
//  HOW TO USE:
//    1. Install Node.js  →  https://nodejs.org
//    2. Run this file:   node browseros-connector.js
//    3. Open BrowserOS in your browser — it auto-connects.
//
//  REQUIREMENTS:  Node.js v16+   (no npm install needed)
//  PORT:          49420
// ============================================================

const http    = require('http');
const os      = require('os');
const fs      = require('fs');
const path    = require('path');
const { exec, spawn } = require('child_process');
const { EventEmitter } = require('events');

const PORT      = 49420;
const VERSION   = '3.0.0';
const ORIGIN_OK = ['http://localhost', 'http://127.0.0.1', 'file://'];

// ── Inline WebSocket server (no npm needed) ─────────────────
// Uses Node's built-in http + manual WS handshake (RFC 6455)
const crypto = require('crypto');

function wsHandshake(req, socket) {
  const key    = req.headers['sec-websocket-key'];
  const accept = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Access-Control-Allow-Origin: *\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );
}

function wsDecode(buf) {
  if (buf.length < 2) return null;
  const fin    = (buf[0] & 0x80) !== 0;
  const opcode = buf[0] & 0x0f;
  const masked  = (buf[1] & 0x80) !== 0;
  let len       = buf[1] & 0x7f;
  let offset    = 2;
  if (len === 126) { len = buf.readUInt16BE(2); offset = 4; }
  else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); offset = 10; }
  if (buf.length < offset + (masked ? 4 : 0) + len) return null;
  let payload;
  if (masked) {
    const mask = buf.slice(offset, offset + 4); offset += 4;
    payload = Buffer.alloc(len);
    for (let i = 0; i < len; i++) payload[i] = buf[offset + i] ^ mask[i % 4];
  } else {
    payload = buf.slice(offset, offset + len);
  }
  return { opcode, payload };
}

function wsEncode(data) {
  const payload = Buffer.from(data, 'utf8');
  const len     = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81; header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81; header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}

// ── Client handler ────────────────────────────────────────────
class ConnectorClient extends EventEmitter {
  constructor(socket) {
    super();
    this.socket  = socket;
    this._buf    = Buffer.alloc(0);
    this._watchers = {};
    socket.on('data', d => { this._buf = Buffer.concat([this._buf, d]); this._parse(); });
    socket.on('close', () => this._cleanup());
    socket.on('error', () => this._cleanup());
  }

  _parse() {
    while (this._buf.length > 0) {
      const frame = wsDecode(this._buf);
      if (!frame) break;
      const consumed = this._buf.length - (this._buf.length - (frame.payload.length +
        (this._buf[1] & 0x7f) < 126 ? 2 : (this._buf[1] & 0x7f) === 126 ? 4 : 10) +
        ((this._buf[1] & 0x80) ? 4 : 0));
      // Simpler: just consume by re-decoding offset
      // Re-calculate consumed bytes properly
      let offset = 2;
      const rawLen = this._buf[1] & 0x7f;
      if (rawLen === 126) offset = 4;
      else if (rawLen === 127) offset = 10;
      if (this._buf[1] & 0x80) offset += 4;
      const totalConsumed = offset + frame.payload.length;
      this._buf = this._buf.slice(totalConsumed);

      if (frame.opcode === 8) { this.socket.destroy(); break; }
      if (frame.opcode === 1) {
        try { this._handle(JSON.parse(frame.payload.toString('utf8'))); } catch {}
      }
    }
  }

  send(obj) {
    try { this.socket.write(wsEncode(JSON.stringify(obj))); } catch {}
  }

  async _handle(msg) {
    if (msg.type === 'handshake') {
      this.send({
        type: 'handshake_ack',
        version: VERSION,
        capabilities: { fs: true, hw: true, bg: true, gpu: false }
      });
      console.log(`  [+] Client connected (BrowserOS ${msg.version || '?'})`);
      return;
    }
    // RPC call
    const { id, method, params } = msg;
    try {
      const result = await this._dispatch(method, params || {});
      this.send({ id, result });
    } catch (err) {
      this.send({ id, error: err.message });
    }
  }

  async _dispatch(method, p) {
    switch (method) {

      // ── FILESYSTEM ───────────────────────────────────────────
      case 'fs.homeDir':  return os.homedir();
      case 'fs.drives':   return this._getDrives();
      case 'fs.readDir':  return this._readDir(p.path);
      case 'fs.readFile': return fs.readFileSync(p.path, p.encoding || 'utf8');
      case 'fs.writeFile': fs.writeFileSync(p.path, p.content, 'utf8'); return true;
      case 'fs.delete':   fs.rmSync(p.path, { recursive: true }); return true;
      case 'fs.mkdir':    fs.mkdirSync(p.path, { recursive: true }); return true;
      case 'fs.rename':   fs.renameSync(p.from, p.to); return true;
      case 'fs.watch':    return this._watchPath(p.path);

      // ── HARDWARE ─────────────────────────────────────────────
      case 'hw.sysinfo':  return this._sysInfo();
      case 'hw.cpu':      return await this._cpuUsage();
      case 'hw.memory':   return this._memInfo();
      case 'hw.battery':  return await this._battery();
      case 'hw.network':  return this._networkInfo();
      case 'hw.usb':      return await this._usbDevices();
      case 'hw.gpu':      return { info: 'WebGPU via browser — GPU compute not available via connector' };

      // ── BACKGROUND SERVICES ──────────────────────────────────
      case 'bg.notify':   return await this._sendNotification(p.title, p.body, p.icon);
      case 'bg.openExternal': return await this._openExternal(p.url);
      case 'bg.exec':     return await this._runProcess(p.cmd, p.args || []);
      case 'bg.schedule': return 'ok'; // stub — extend with node-cron if needed
      case 'bg.list':     return [];

      default: throw new Error(`Unknown method: ${method}`);
    }
  }

  // ── FS helpers ───────────────────────────────────────────────
  _readDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.map(e => {
      let size = 0;
      try { if (e.isFile()) size = fs.statSync(path.join(dirPath, e.name)).size; } catch {}
      return { name: e.name, isDir: e.isDirectory(), isFile: e.isFile(), size };
    });
  }

  _getDrives() {
    if (process.platform === 'win32') {
      return new Promise(res => {
        exec('wmic logicaldisk get caption', (err, out) => {
          if (err) { res([{ path: 'C:\\', label: 'C:' }]); return; }
          const drives = out.split('\n').map(l => l.trim()).filter(l => /^[A-Z]:/.test(l));
          res(drives.map(d => ({ path: d + '\\', label: d })));
        });
      });
    }
    return [{ path: '/', label: 'Root' }, { path: os.homedir(), label: 'Home' }];
  }

  _watchPath(watchPath) {
    if (this._watchers[watchPath]) return 'already watching';
    const watcher = fs.watch(watchPath, { recursive: false }, (event, filename) => {
      this.send({ type: 'event', event: 'fs:change', data: { path: watchPath, event, filename } });
    });
    this._watchers[watchPath] = watcher;
    return 'watching';
  }

  // ── HW helpers ───────────────────────────────────────────────
  _sysInfo() {
    const cpus = os.cpus();
    return {
      platform:    process.platform,
      arch:        process.arch,
      hostname:    os.hostname(),
      os_type:     os.type(),
      os_release:  os.release(),
      cpu_model:   cpus[0]?.model || 'Unknown',
      cpu_cores:   cpus.length,
      total_ram:   (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free_ram:    (os.freemem()  / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      uptime:      (os.uptime() / 3600).toFixed(1) + ' hours',
      node_version: process.version,
    };
  }

  _cpuUsage() {
    return new Promise(res => {
      const start = os.cpus().map(c => ({ ...c.times }));
      setTimeout(() => {
        const end = os.cpus();
        const usage = end.map((cpu, i) => {
          const s = start[i], e = cpu.times;
          const totalDiff = Object.keys(e).reduce((a, k) => a + (e[k] - (s[k]||0)), 0);
          const idleDiff  = e.idle - (s.idle || 0);
          return Math.round(100 * (1 - idleDiff / totalDiff));
        });
        const avg = Math.round(usage.reduce((a,b) => a+b, 0) / usage.length);
        res({ per_core: usage, average: avg + '%', cores: usage.length });
      }, 200);
    });
  }

  _memInfo() {
    const total = os.totalmem();
    const free  = os.freemem();
    const used  = total - free;
    return {
      total:      (total / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used:       (used  / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free:       (free  / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      percent:    Math.round(used / total * 100) + '%',
    };
  }

  _battery() {
    // Use system_profiler on macOS, upower on Linux, WMIC on Windows
    return new Promise(res => {
      if (process.platform === 'darwin') {
        exec('pmset -g batt', (err, out) => {
          if (err) { res({ supported: false }); return; }
          const pct = out.match(/(\d+)%/)?.[1];
          const charging = out.includes('AC Power') || out.includes('charging');
          res({ percent: pct ? parseInt(pct) : null, charging, supported: true });
        });
      } else if (process.platform === 'linux') {
        exec("cat /sys/class/power_supply/BAT0/capacity 2>/dev/null && cat /sys/class/power_supply/BAT0/status 2>/dev/null", (err, out) => {
          const lines = out.trim().split('\n');
          res({ percent: parseInt(lines[0]) || null, charging: lines[1] === 'Charging', supported: !err });
        });
      } else if (process.platform === 'win32') {
        exec('WMIC Path Win32_Battery Get EstimatedChargeRemaining /Format:Value', (err, out) => {
          const pct = out.match(/(\d+)/)?.[1];
          res({ percent: pct ? parseInt(pct) : null, supported: !err });
        });
      } else {
        res({ supported: false });
      }
    });
  }

  _networkInfo() {
    const ifaces = os.networkInterfaces();
    return Object.entries(ifaces).map(([name, addrs]) => ({
      name,
      addresses: addrs.map(a => ({ family: a.family, address: a.address, internal: a.internal }))
    }));
  }

  _usbDevices() {
    return new Promise(res => {
      if (process.platform === 'linux') {
        exec('lsusb 2>/dev/null', (err, out) => {
          if (err) { res([]); return; }
          res(out.trim().split('\n').map(l => ({ description: l })));
        });
      } else if (process.platform === 'darwin') {
        exec('system_profiler SPUSBDataType 2>/dev/null | grep "Product Name" | head -20', (err, out) => {
          res(out.trim().split('\n').map(l => ({ description: l.trim() })));
        });
      } else {
        res([{ description: 'USB enumeration not implemented for ' + process.platform }]);
      }
    });
  }

  // ── BG helpers ───────────────────────────────────────────────
  _sendNotification(title, body, icon) {
    return new Promise(res => {
      const t = (title || 'BrowserOS').replace(/"/g, "'");
      const b = (body  || '').replace(/"/g, "'");
      let cmd;
      if      (process.platform === 'darwin')  cmd = `osascript -e 'display notification "${b}" with title "${t}"'`;
      else if (process.platform === 'linux')   cmd = `notify-send "${t}" "${b}" 2>/dev/null || true`;
      else if (process.platform === 'win32')
        cmd = `powershell -Command "& {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${b}','${t}')}"`;
      if (cmd) exec(cmd, () => res(true));
      else res(false);
    });
  }

  _openExternal(url) {
    return new Promise(res => {
      const cmd = process.platform === 'darwin'  ? `open "${url}"` :
                  process.platform === 'win32'   ? `start "" "${url}"` :
                                                   `xdg-open "${url}"`;
      exec(cmd, () => res(true));
    });
  }

  _runProcess(cmd, args) {
    return new Promise((res, rej) => {
      const proc = spawn(cmd, args, { shell: true });
      let stdout = '', stderr = '';
      proc.stdout.on('data', d => stdout += d.toString());
      proc.stderr.on('data', d => stderr += d.toString());
      proc.on('close', code => res({ code, stdout, stderr }));
      proc.on('error', err => rej(err));
      setTimeout(() => { try { proc.kill(); } catch {} rej(new Error('Process timeout')); }, 10000);
    });
  }

  _cleanup() {
    Object.values(this._watchers).forEach(w => { try { w.close(); } catch {} });
    this._watchers = {};
  }
}

// ── HTTP + WebSocket Server ───────────────────────────────────
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end(`BrowserOS Connector v${VERSION} running on port ${PORT}`);
});

server.on('upgrade', (req, socket, head) => {
  // Basic origin check
  const origin = req.headers.origin || '';
  const allowed = ORIGIN_OK.some(o => origin.startsWith(o)) || !origin;
  if (!allowed) { socket.destroy(); return; }
  wsHandshake(req, socket);
  new ConnectorClient(socket);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   BrowserOS Native Connector  v' + VERSION + '   ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log('  ║                                          ║');
  console.log('  ║   Status:  ● RUNNING                     ║');
  console.log(`  ║   Port:    ${PORT}                        ║`);
  console.log('  ║                                          ║');
  console.log('  ║   Capabilities:                          ║');
  console.log('  ║     ✓ Filesystem  (real disk r/w)        ║');
  console.log('  ║     ✓ Hardware    (CPU, RAM, battery)    ║');
  console.log('  ║     ✓ Background  (notifications, exec)  ║');
  console.log('  ║     ✗ GPU Compute (use WebGPU in browser)║');
  console.log('  ║                                          ║');
  console.log('  ║   Open BrowserOS in your browser and     ║');
  console.log('  ║   it will connect automatically.         ║');
  console.log('  ║                                          ║');
  console.log('  ║   Press Ctrl+C to stop.                  ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log('  Platform:  ' + process.platform + ' ' + process.arch);
  console.log('  Node.js:   ' + process.version);
  console.log('  Home dir:  ' + os.homedir());
  console.log('');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ERROR: Port ${PORT} is already in use.`);
    console.error('  Another instance may already be running.\n');
  } else {
    console.error('  Server error:', err.message);
  }
  process.exit(1);
});

process.on('SIGINT',  () => { console.log('\n  Connector stopped.'); process.exit(0); });
process.on('SIGTERM', () => { console.log('\n  Connector stopped.'); process.exit(0); });
