// SPA/API routes, mounted at '/' in app.ts. Meant for regular users (not the admin panel).
import express from 'express'; // web framework
const router = express.Router(); // creates a router instance to attach routes to
import memberController from './controllers/member.controller'; // handlers for these routes

router.get('/', memberController.goHome); // landing page

/** Member **/
router.post('/member/login', memberController.login); // returns JSON + accessToken cookie
router.post('/member/signup', memberController.signup); // returns JSON + accessToken cookie
router.get('/member/detail', memberController.verifyAuth); // checks the token cookie, returns the member inside it

export default router; // exported so app.ts can mount it
