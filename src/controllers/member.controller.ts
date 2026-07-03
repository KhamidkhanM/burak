// SPA/API controller — handles requests from router.ts ('/' routes). Returns JSON, no EJS.
import { Request, Response} from 'express' // Express types
import { T } from '../libs/types/common'; // generic object type
import MemberService from '../models/member.service'; // business logic for members
import { MemberInput, LogInput, Member } from '../libs/types/member'; // typed input/output shapes
import Errors from '../libs/types/errors'; // custom error class
import AuthService from '../models/auth.service'; // creates JWT tokens

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
        console.log("token =>", token); // debug log

        res.json({ member: result }); // send the created member back as JSON
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
        console.log("token =>", token); // debug log

        res.json({ member: result }); // send the logged-in member back as JSON
        // res.send("DONE");
    } catch (err) {
        console.log("Error, login:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
        // res.json({});
    }
};





export default memberController; // exported so router.ts can use these handlers
