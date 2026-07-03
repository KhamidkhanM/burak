// SPA/API controller — handles requests from router.ts ('/' routes). Returns JSON, no EJS.
import { Request, Response} from 'express' // Express types
import { T } from '../libs/types/common'; // generic object type
import MemberService from '../models/member.service'; // business logic for members
import { MemberInput, LogInput, Member } from '../libs/types/member'; // typed input/output shapes
import Errors, { HttpCode, Message } from '../libs/types/errors'; // custom error class + codes/messages
import AuthService from '../models/auth.service'; // creates JWT tokens
import { AUTH_TIMER } from '../libs/config'; // token/cookie lifetime in hours

const memberController: T = {}; // plain object that holds all the route handler functions

const memberService = new MemberService(); // single shared instance of the service
const authService = new AuthService(); // single shared instance of the auth service

// landing page (shared EJS view, but used here for the SPA entry point)
memberController.goHome = function (_req: Request, res: Response) {
    try {
        res.render('home'); // renders views/home.ejs
    } catch (err) {
        console.log('Error in goHome:', err); // log unexpected error
    }
};

// API signup: creates a regular USER account and returns it as JSON
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup"); // debug log


        const input: MemberInput = req.body; // request body cast to the expected shape
        const result: Member = await memberService.signup(input); // create the user in MongoDB
        const token = await authService.createToken(result); // create a JWT for the new member

        res.cookie("accessToken", token, { // store the token in a browser cookie
            maxAge: AUTH_TIMER * 3600 * 1000, // cookie lifetime in ms (24h, same as the token)
            httpOnly: false, // false = frontend JS can read the cookie too
        });
        res.status(HttpCode.CREATED).json({ member: result, accessToken: token }); // 201 + member + token
    } catch (err) {
        console.log("Error, signup:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
        // res.json({ });
    }
};

// API login: checks credentials and returns the member as JSON (no session/token yet)
memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login"); // debug log
        const input: LogInput = req.body; // request body cast to the login shape
        const result: Member = await memberService.login(input); // verify nick/password against the DB
        const token = await authService.createToken(result); // create a JWT for the logged-in member

        res.cookie("accessToken", token, { // store the token in a browser cookie
            maxAge: AUTH_TIMER * 3600 * 1000, // cookie lifetime in ms (24h, same as the token)
            httpOnly: false, // false = frontend JS can read the cookie too
        });
        res.status(HttpCode.OK).json({ member: result, accessToken: token }); // 200 + member + token
    } catch (err) {
        console.log("Error, login:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
        // res.json({});
    }
};





// API auth check: reads the accessToken cookie and returns the member inside it (or 401)
memberController.verifyAuth = async (req: Request, res: Response) => {
    try {
        let member = null; // will hold the decoded member if the token is valid
        const token = req.cookies["accessToken"]; // grab the JWT from the browser cookie (needs cookie-parser)
        if (token) member = await authService.checkAuth(token); // verify signature + expiry, decode the member
        if (!member)
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED); // no/invalid token: not logged in

        console.log("member:", member); // debug log
        res.status(HttpCode.OK).json({ member: member }); // valid token: return the member data
    } catch (err) {
        console.log("Error, verifyAuth:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
    }
};

export default memberController; // exported so router.ts can use these handlers
