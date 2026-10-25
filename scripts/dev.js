const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

console.log('🚀 Starting Whitelabelling Engine (Backend on 5001 + Frontend on 3001)...');
console.log('----------------------------------------------------------------------');

const npmExecutable = isWin ? 'npm.cmd' : 'npm';

// 1. Backend Server (Port 5001)
const backend = spawn(process.execPath, [path.join(rootDir, 'backend', 'server.js')], {
  cwd: rootDir,
  stdio: 'inherit',
});

// 2. Frontend Vite Dev Server (Port 3001)
const frontend = spawn(npmExecutable, ['--prefix', path.join(rootDir, 'frontend'), 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
});

function cleanup() {
  console.log('\n🛑 Shutting down backend & frontend...');
  try {
    if (isWin) {
      if (backend.pid) spawn('taskkill', ['/F', '/T', '/PID', backend.pid.toString()]);
      if (frontend.pid) spawn('taskkill', ['/F', '/T', '/PID', frontend.pid.toString()]);
    } else {
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
    }
  } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
