 import express from 'express';
 import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile, changeUserPassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';


 const userRouter= express.Router();

 // public routes
    userRouter.post('/register', registerUser);
    userRouter.post('/login', loginUser);

    // private routes
    userRouter.get('/me', authMiddleware,getUserProfile);
    userRouter.put('/update',authMiddleware, updateUserProfile);
    userRouter.put('/password',authMiddleware,changeUserPassword)
    userRouter.delete('/delete',authMiddleware, deleteUserProfile);


    export default userRouter;


