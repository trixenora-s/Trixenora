const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Game = require('../models/Game');
const AITool = require('../models/AITool');

const router = express.Router();

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('gamesUploaded')
      .populate('aiToolsUploaded')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.patch('/profile/me', auth, async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { displayName, bio, avatar },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's games
router.get('/:id/games', async (req, res) => {
  try {
    const games = await Game.find({ developer: req.params.id, status: 'published' });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's AI tools
router.get('/:id/ai-tools', async (req, res) => {
  try {
    const tools = await AITool.find({ creator: req.params.id });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.following.includes(req.params.id)) {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
      await currentUser.save();
      await userToFollow.save();
    }

    res.json({ message: 'User followed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
