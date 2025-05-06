import express from 'express';
import { register, login } from '../Controllers/auth.ts';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;