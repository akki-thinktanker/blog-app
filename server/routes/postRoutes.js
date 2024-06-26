const {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletepost,
} = require('../controllers/postController');
const { verifyJWT } = require('../middleware/authMiddleware');

const postRouter = require('express').Router();

// Define CRUD Routes
postRouter.route('/').post(verifyJWT, createPost).get(verifyJWT, getAllPosts);
postRouter.route('/:postId').get(getPost).patch(updatePost).delete(deletepost);

module.exports = postRouter;
