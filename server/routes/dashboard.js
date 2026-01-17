const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Game = require('../models/Game');
const AITool = require('../models/AITool');

const router = express.Router();

// Get user dashboard
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const games = await Game.find({ developer: req.user.id });
    const aiTools = await AITool.find({ creator: req.user.id });

    const gameStats = {
      total: games.length,
      published: games.filter(g => g.status === 'published').length,
      totalDownloads: games.reduce((sum, g) => sum + g.downloads, 0)
    };

    const toolStats = {
      total: aiTools.length,
      released: aiTools.filter(t => t.status === 'released').length,
      totalDownloads: aiTools.reduce((sum, t) => sum + t.downloads, 0)
    };

    res.json({
      user,
      gameStats,
      toolStats,
      recentGames: games.slice(0, 5),
      recentTools: aiTools.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGames = await Game.countDocuments({ status: 'published' });
    const totalTools = await AITool.countDocuments();
    const totalDownloads = await Game.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);

    res.json({
      totalUsers,
      totalGames,
      totalTools,
      totalDownloads: totalDownloads[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
