import express from 'express';
import {loginController, registerController, updateUserController,requireSignIn} from '../controllers/UserController.js'


const UserRouter = express.Router();

UserRouter.post('/register',registerController)
UserRouter.post('/login',loginController)
UserRouter.put('/update-user',requireSignIn,updateUserController)

export default UserRouter;

