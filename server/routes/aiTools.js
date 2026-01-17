const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const AITool = require('../models/AITool');

const router = express.Router();

// Get all AI tools
router.get('/', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = { status: { $ne: 'deprecated' } };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tools = await AITool.find(query)
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload AI tool
router.post('/upload', auth, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), [
  body('name').notEmpty(),
  body('description').optional(),
  body('category').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.files.file) {
      return res.status(400).json({ error: 'No tool file provided' });
    }

    const { name, description, category, documentation, requirements, version } = req.body;

    const tool = new AITool({
      name,
      description,
      creator: req.user.id,
      category,
      version,
      documentation,
      requirements,
      fileUrl: `/uploads/${req.files.file[0].filename}`,
      thumbnail: req.files.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null,
      fileSize: req.files.file[0].size,
      status: 'development'
    });

    await tool.save();
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update AI tool status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    let tool = await AITool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    if (tool.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    tool.status = status;
    tool.updatedAt = new Date();
    await tool.save();

    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tool by ID
router.get('/:id', async (req, res) => {
  try {
    const tool = await AITool.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('reviews.userId', 'username avatar');

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    tool.downloads += 1;
    await tool.save();

    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const tool = await AITool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    tool.reviews.push({
      userId: req.user.id,
      rating,
      comment,
      date: new Date()
    });

    tool.rating = (tool.reviews.reduce((sum, r) => sum + r.rating, 0) / tool.reviews.length).toFixed(1);
    await tool.save();

    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
