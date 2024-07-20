import PostModel from "../models/PostModel.js";
import UserModel from "../models/UserModel.js";

const PostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // validate
    if (!title || !description) {
      return res.status(501).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    const SinglePost = await PostModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();

    const user = await UserModel.find({ _id: req.auth._id }, { name: 1 });

    const Post = {
      title: SinglePost.title,
      description: SinglePost.description,
      _id: SinglePost._id,
      createdAt: SinglePost.createdAt,
      updatedAt: SinglePost.updatedAt,
      postedBy: {
        _id: req.auth._id,
        name: user[0].name,
      },
    };

    // console.log(Post);

    res.status(200).send({
      success: true,
      message: "Post Created Successfully",
      Post,
    });
    // console.log(req)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Post Api",
      error,
    });
  }
};

// Get all post

const getAllPostsController = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAll Post API ",
      error,
    });
  }
};

// Get User all post
const getUserAllPostsController = async (req, res) => {
  try {
    const _id = req.auth._id;
    const UserPosts = await PostModel.find({ postedBy: _id }).sort({
      createdAt: -1,
    });
    res.status(200).send({
      success: true,
      message: "user posts",
      UserPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get User all posts api",
      error,
    });
  }
};

// Delete User Post
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await PostModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Your Post been deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete post api",
      error,
    });
  }
};

// Edit User Post
const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    // post find
    const post = await PostModel.findById({ _id: id });
    // validation
    if (!title || !description) {
      return res.status(501).send({
        success: false,
        message: "Please provide post title or description",
      });
    }
    const updatePost = await PostModel.findByIdAndUpdate(
      { _id: id },
      {
        title: title || post.title,
        description: description || post.description,
      },
      { new: true }
    );
    res.status(200).send({
      success:true,
      message:'Post Updated Successfully',
      updatePost
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update post api",
      error,
    });
  }
};

export {
  getAllPostsController,
  PostController,
  getUserAllPostsController,
  deletePostController,
  updatePostController,
};
