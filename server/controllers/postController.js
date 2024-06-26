const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const data = { title, content, author: req.user._id };

    const post = await Post.create(data);

    return res.status(200).json({ error: false, statusCode: 200, data: post });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Server error',
      statusCode: 500,
    });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ _id: postId }).populate('author');

    return res.status(200).json({ error: false, statusCode: 200, data: post });
  } catch (error) {
    return res.status(404).json({
      error: true,
      status: 404,
      message: 'Post not found',
    });
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('author');

    res.status(200).json({ error: false, statusCode: 200, data: posts });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, statusCode: 500, message: 'Internal server error' });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({ error: false, statusCode: 200, data: post });
  } catch (error) {
    return res.status(404).json({
      error: true,
      status: 404,
      message: 'Post not found',
    });
  }
};

exports.deletepost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const deletedPost = await Post.findOneAndDelete({ _id: postId });

  return res
    .status(200)
    .json({ error: false, statusCode: 204, data: deletedPost });
});
