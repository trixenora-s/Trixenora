const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Game = require('../models/Game');

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const { platform, genre, search } = req.query;
    let query = { status: 'published' };

    if (platform) query.platforms = platform;
    if (genre) query.genre = genre;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const games = await Game.find(query)
      .populate('developer', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload game
router.post('/upload', auth, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), [
  body('title').notEmpty(),
  body('description').optional(),
  body('platforms').isArray(),
  body('genre').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.files.file) {
      return res.status(400).json({ error: 'No game file provided' });
    }

    const { title, description, platforms, genre, minRequirements, version } = req.body;

    const game = new Game({
      title,
      description,
      developer: req.user.id,
      platforms: JSON.parse(platforms),
      genre,
      version,
      minRequirements,
      downloadUrl: `/uploads/${req.files.file[0].filename}`,
      thumbnail: req.files.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null,
      fileSize: req.files.file[0].size,
      status: 'draft'
    });

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish game
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.developer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    game.status = 'published';
    game.updatedAt = new Date();
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('developer', 'username avatar')
      .populate('reviews.userId', 'username avatar');

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.downloads += 1;
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.reviews.push({
      userId: req.user.id,
      rating,
      comment,
      date: new Date()
    });

    game.rating = (game.reviews.reduce((sum, r) => sum + r.rating, 0) / game.reviews.length).toFixed(1);
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
