// SPA/API routes, mounted at '/' in app.ts. Meant for regular users (not the admin panel).
import express from 'express';
const router = express.Router();
import memberController from './controllers/member.controller';

router.get('/', memberController.goHome); // landing page

router.post('/login', memberController.login); // returns JSON, used by SPA frontend

router.post('/signup', memberController.signup); // returns JSON, used by SPA frontend


export default router;