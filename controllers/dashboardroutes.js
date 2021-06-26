const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: { user_id: req.session.user_id },
            include: [
            { model: User, attributes: ['user_name'] },
            { model: Comment  },
            ]
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        console.log(posts);
        res.render('/dashboard', { posts, logged_in: req.session.logged_in });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});



router.get('/edit/:id', withAuth, async (req, res) => {
try {
    const postData = await Post.findOne({
        where: { post_id: req.params.id },
        include: [{ model: User, attributes: ['user_name'] },
        { model: Comment, attributes: ['comment_id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: { model: User, attributes: ['user_name'] }
        }]
    });
    if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
    const post = postData.get({ plain: true });
    res.render('edit-post', { post, logged_in: req.session.logged_in});
} 
catch (err) {
    console.log(err)
    res.status(500).json(err);
}
});



router.get('/new', (req, res) => {
    res.render('new-post');
});



module.exports = router;
