import { Router } from 'express';
import { createUser, loginUser, getUsers, getUserById, updateUser, deleteUser } from './user.controllers';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

