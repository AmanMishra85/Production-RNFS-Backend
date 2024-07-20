import express from 'express';
import { requireSignIn } from '../controllers/UserController.js';
import {PostController,deletePostController,updatePostController,getAllPostsController, getUserAllPostsController} from '../controllers/PostController.js';

const PostRouter = express.Router();

PostRouter.post('/create-post',requireSignIn,PostController)
PostRouter.get('/get-all-post',getAllPostsController)
PostRouter.get('/get-user-post',requireSignIn,getUserAllPostsController)
PostRouter.delete('/delete-post/:id',requireSignIn,deletePostController)
PostRouter.put('/update-post/:id',requireSignIn,updatePostController)

export default PostRouter;