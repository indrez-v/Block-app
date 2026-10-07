const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { 
          model: Comment, 
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['username'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { 
          model: Comment, 
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['username'] }]
        }
      ]
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      userId: req.user.id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this post' });
    }

    const { title, content } = req.body;
    await post.update({ title, content });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
