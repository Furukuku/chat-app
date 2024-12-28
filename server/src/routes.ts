import express from 'express';
import { create, index, login } from './controllers/UserController';
import auth from './middlewares/auth';
import guest from './middlewares/guest';

const router = express.Router();

router.get('/register', guest);
router.post('/register', create);
router.get('/login', guest);
router.post('/login', login);
router.get('/', auth, index);

export default router;