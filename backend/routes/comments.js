const express = require('express');
const router = express.Router();
const { Comment, Post } = require('../models');
const auth = require('../middleware/auth');

// Add comment to a post
router.post('/post/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = await Comment.create({
      content,
      postId,
      userId: req.user.id
    });
    
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
