import express from 'express';
import { register, verify } from '../controllers/user.js'; 

const router = express.Router();

// Route to register a new user
router.post('/register', register);

// Route to verify user email
router.get('/verify/:userId/:token', verify);

export {router as UserRouter};
