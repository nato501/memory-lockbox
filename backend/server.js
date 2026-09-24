import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (request, response) => {
    response.json({ ok: true, service: 'our-love-space-backend' });
});

app.get('/api/status', (request, response) => {
    response.json({
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

async function startServer() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing. Copy .env.example to .env and add your MongoDB Atlas URI.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
        console.log(`Backend listening on http://localhost:${port}`);
    });
}

startServer().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
