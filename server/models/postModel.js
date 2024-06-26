const mongoose = require('mongoose');

const PostModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', PostModel);

module.exports = Post;
