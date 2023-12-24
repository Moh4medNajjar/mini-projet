const express = require('express');
const router = express.Router();
const Comment = require('../db/models/comment');
const User = require('../db/models/user');
router.use(express.json());

// POST
router.post('/add', async (req, res) => {
  try {
    const { username, text } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const comment = new Comment({
      user: { username },
      text,
    });

    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// GET_ALL
router.get('/all', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, edited: true },
      { new: true }
    );
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;