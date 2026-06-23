// SPA/API routes, mounted at '/' in app.ts. Meant for regular users (not the admin panel).
import express from 'express'; // web framework
const router = express.Router(); // creates a router instance to attach routes to
import memberController from './controllers/member.controller'; // handlers for these routes

router.get('/', memberController.goHome); // landing page

router.post('/login', memberController.login); // returns JSON, used by SPA frontend

router.post('/signup', memberController.signup); // returns JSON, used by SPA frontend


export default router; // exported so app.ts can mount it
