const router = require('express').Router();
const { User, Post, Comment } = require('../../models');


router.get('/', async (req, res) => {
  try{
    const userData = await User.findAll ({
      attributes: { exclude: ['[password]']}
     });
     res.status(200).json(userData);
  const users = userData.map((user) => user.get({ plain: true }));
  console.log(users)
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});


router.get('/:id', async (req, res) => {
  try{
    const userData = await User.findOne ({
      where: {
        user_id: req.params.id
    },
      attributes: { exclude: ['[password]']},
        include: [{ model: Post, model: Comment }]
    });
    res.status(200).json(userData);
  const users = userData.map((user) => user.get({ plain: true }));
  } catch (err) {
    res.status(500).json(err);
  }
});

     
  
router.post('/', async (req, res) => {
  try {
    const userData = await User.create({ 
      user_name: req.body.name,
      user_email: req.body.email,
      password: req.body.password
     });

    
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.user_name = userData.user_name;
      req.session.loggedIn = true;
      res.status(200).json(userData);
 });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { user_email: req.body.username } });
    console.log(req.body.username)

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.user_id;
      req.session.logged_in = true;
     console.log('You are now logged in!') 
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});


router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.user_id;
      req.session.logged_in = true;
     console.log('You are now logged in!') 
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});






router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


router.put('/:id', async (req, res) => {
  User.update(
    {
      user_id: req.body.id,
      user_name: req.body.name,
    },
    {
       where: {
        user_id: req.params.id,
      },
    }
  )
    .then((updatedUser) => {
     res.status(200).json(updatedUser);
    })
    .catch((err) => res.json(err));
});





router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        user_id: req.params.id
      }
    });

    if (!userData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
