const router = require('express').Router();
const {  Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');


router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll(
      {
     include: [ 
    { model : User },
    { model : Comment },
     ]
    }
    );
   res.status(200).json(postData);
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts);
      } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
 });

// get one post
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findOne( {
        where: {
            post_id: req.params.id
        },
        include: [
         { model : Comment },
        { model : User }
          ]
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
try {
const postData = await Post.create({
    post_title : req.body.title,
    post_content : req.body.content,
    user_id : req.session.user_id
});
res.status(200).json(postData);
} catch (err) {
    res.status(500).json(err);
  }
});
 


router.put('/edit', withAuth, (req, res) => {
    Post.update({
        post_title: req.body.title,
        post_content: req.body.content
    }, {
        where: {
            post_id: req.body.id
        }
    }).then(postData => {
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.status(200).json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    }); 
});

router.delete('/delete', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
     post_id: req.body.id
      }
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;