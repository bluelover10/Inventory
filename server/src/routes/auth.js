import { Router } from 'express';
import { register, login, me, listUsers, updateUser } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, userUpdateSchemaJoi } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimit.js';

const r = Router();
r.post('/register', authLimiter, validate(registerSchema), register);
r.post('/login', authLimiter, validate(loginSchema), login);
r.get('/me', protect, me);
r.get('/users', protect, authorize('super_admin'), listUsers);
r.patch('/users/:id', protect, authorize('super_admin'), validate(userUpdateSchemaJoi), updateUser);
export default r;
