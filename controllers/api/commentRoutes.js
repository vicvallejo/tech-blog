  
const router = require('express').Router();
const { Comment, Post, User } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.findAll();
      res.status(200).json(commentData);
      const comments = commentData.map((comment) => comment.get({ plain: true }));
        console.log(comments);
       } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
   });

   router.get('/:id', async (req, res) => {
    try {
      const commentData = await Comment.findOne( {
          where: {
              comment_id: req.params.id
          },
          include: [
           { model : User }
          ]
      });
  
      if (!commentData) {
        res.status(404).json({ message: 'No comment found with this id!' });
        return;
      }
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.post('/', withAuth, async (req, res) => {
    try {
    const commentData = await Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id,
    });
    res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
      }
    });

    router.put('/:id', withAuth, (req, res) => {
        Comment.update({
            comment_text: req.body.comment_text
        }, {
            where: {
                comment_id: req.params.id
            }
        }).then(commentData => {
            if (!commentData) {
                res.status(404).json({ message: 'No comment found with this id' });
                return;
            }            
            res.status(200).json(commentData);
        })
        
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }); 
    });
    
    router.delete('/:id', withAuth, async (req, res) => {
        try {
          const commentData = await Comment.destroy({
            where: {
           comment_id: req.params.id
            }
          });
          if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
          }
          res.status(200).json(commentData);
        } catch (err) {
          res.status(500).json(err);
        }
      });
      
      module.exports = router;


