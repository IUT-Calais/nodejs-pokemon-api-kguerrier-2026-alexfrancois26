import { Router } from 'express';
import { createUser } from './user.controllers';
import { loginUser } from './user.controllers';

export const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
