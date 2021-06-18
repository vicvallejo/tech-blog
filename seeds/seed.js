const sequelize = require('../config/connection');
const { User, Comment, Post } = require('../models');

const userData = require('./userData.json');
const postData = require('./post.json');
const commentData = require('./comments.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
      });

      console.log('\n----- USER TABLE SYNC -----\n');

      
  await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  });

  console.log('\n----- POST TABLE SYNC -----\n');

  await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  });

  console.log('\n----- COMMENT TABLE  SYNC -----\n');



  process.exit(0);
};

seedDatabase();
