import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 5570;

app.use(cors());
app.use(express.json());

// Serve static client build in production
app.use(express.static(join(__dirname, '../client/dist')));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Game state
const players = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Player connected: ${socket.id}`);

  players.set(socket.id, {
    id: socket.id,
    position: { x: 0, y: 2, z: 0 },
    rotation: { y: 0 },
    state: 'GROUNDED',
    velocity: { x: 0, y: 0, z: 0 },
  });

  // Send current players to new connection
  socket.emit('players:init', Array.from(players.values()));

  // Broadcast new player to others
  socket.broadcast.emit('player:joined', players.get(socket.id));

  socket.on('player:move', (data) => {
    const player = players.get(socket.id);
    if (player) {
      if (data.position) player.position = data.position;
      if (data.rotation) player.rotation = data.rotation;
      if (data.state) player.state = data.state;
      if (data.velocity) player.velocity = data.velocity;
      socket.broadcast.emit('player:moved', { id: socket.id, ...data });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Player disconnected: ${socket.id}`);
    players.delete(socket.id);
    io.emit('player:left', socket.id);
  });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OpenWorld server running on port ${PORT}`);
});
