const sequelize = require('../config/connection');
const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll(
      {
        include: [
        { model: User, attributes: ['user_name'] }, 
        { model : Comment }
        ]
          }
     
    );
    const posts = postData.map((post) => post.get({ plain: true }));
  console.log(posts);
    res.render('homepage', { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findOne(
      {
        where: {
          post_id: req.params.id
      },
      include: [{ model: Comment, attributes: ['comment_id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      include: { model: User, attributes: ['user_name']}},
         { model: User,attributes: ['user_name']}
      ]});
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
  }

  const post = postData.get({ plain: true });
  console.log(post);
  res.render('single-post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});
  

     
router.get('/posts-comments', async (req, res) => {
  try {
    const postData = await Post.findOne(
      {
        where: {
          post_id: req.params.id
      },
      include: [{ model: Comment, attributes: ['comment_id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      include: { model: User, attributes: ['user_name']}},
          { model: User,attributes: ['user_name']}
      ]});
        if (!postData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
          }
          const post = postData.get({ plain: true });
          console.log(post);
          res.render('single-post', { post, loggedIn: req.session.loggedIn });
          } catch (err) {
            res.status(500).json(err);
          }
        });
          
          

module.exports = router;
