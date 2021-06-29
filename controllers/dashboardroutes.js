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
            ]
        });

        const commentData = await Comment.findAll();
        const posts = postData.map((post) => post.get({ plain: true }));
        const comments = commentData.map((comment) => comment.get({ plain: true }));

        console.log(posts);
        res.render('dashboard', {
             posts,
             comments,
             logged_in: true
             });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});



router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: { post_id: req.params.id },
            include: [
                   { model: User, attributes: ['user_name'] },
            ]
        });

        const commentData = await Comment.findAll();
        const post = postData.get({ plain: true });
        const comments = commentData.map((comment) => comment.get({ plain: true }));

        console.log(post);
        res.render('editpost', {
             post,
             comments,
            });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});







router.get('/newpost', (req, res) => {
    res.render('newpost');
});



module.exports = router;
