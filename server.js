const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Database simulation (in-memory)
let users = [];
let videos = [];
let refreshTokens = [];

// JWT Secret (in production, use environment variables)
const JWT_SECRET = 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret_key';

// Helper functions
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(user);

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.status(201).json({
            user: { id: user.id, username: user.username, email: user.email },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.json({
            user: { id: user.id, username: user.username, email: user.email },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});

// Token refresh
app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
});

// User logout
app.post('/api/auth/logout', (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.sendStatus(404);

    res.json({
        user: { id: user.id, username: user.username, email: user.email }
    });
});

// Video routes

// Get all videos
app.get('/api/videos', (req, res) => {
    res.json(videos);
});

// Get video by ID
app.get('/api/videos/:id', (req, res) => {
    const video = videos.find(v => v.id === parseInt(req.params.id));
    if (!video) return res.status(404).send('Video not found');
    res.json(video);
});

// Upload video
app.post('/api/videos', authenticateToken, upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const { title, description, category } = req.body;
        const user = users.find(u => u.id === req.user.id);

        const video = {
            id: videos.length + 1,
            title,
            description: description || '',
            thumbnail: req.body.thumbnail || '/uploads/default-thumbnail.jpg',
            videoUrl: `/uploads/${req.file.filename}`,
            channel: user.username,
            userId: user.id,
            views: 0,
            likes: 0,
            dislikes: 0,
            category: category || 'General',
            timestamp: new Date(),
            duration: req.body.duration || '0:00',
            comments: []
        };

        videos.push(video);
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Video upload failed' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});