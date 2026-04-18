import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Example API route for handling PDF logic on the server if needed later
  app.post('/api/process-pdf', (req, res) => {
    // This is where you can add Node.js specific PDF processing logic
    res.json({ message: 'Ready to process PDF on Node.js backend' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    // Serving static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production build from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node.js server running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
