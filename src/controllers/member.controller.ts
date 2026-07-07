// SPA/API controller — handles requests from router.ts ('/' routes). Returns JSON, no EJS.
import { NextFunction, Request, Response } from 'express' // Express types
import { T } from '../libs/types/common'; // generic object type
import MemberService from '../models/member.service'; // business logic for members
import { MemberInput, LogInput, Member, ExtendedRequest, MemberUpdateInput } from '../libs/types/member'; // typed input/output shapes
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





// API logout: clears the accessToken cookie so the browser is no longer authenticated
memberController.logout = (req: ExtendedRequest, res: Response) => {
    try {
        console.log("logout"); // debug log
        res.cookie("accessToken", null, { // overwrite the cookie with null
            maxAge: 0, // expire it immediately, the browser deletes it
            httpOnly: true, // not readable by frontend JS anymore
        });
        res.status(HttpCode.OK).json({ logout: true }); // confirm the logout
    } catch (err) {
        console.log("Error, logout:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
    }
};

// API member detail: returns fresh data of the logged-in member (runs after verifyAuth middleware)
memberController.getMemberDetail = async (
    req: ExtendedRequest,
    res: Response,
) => {
    try {
        console.log("getMemberDetail"); // debug log
        const result = await memberService.getMemberDetail(req.member); // req.member was set by verifyAuth
        res.status(HttpCode.OK).json(result); // send the fresh member data back as JSON
    } catch (err) {
        console.log("Error, getMemberDetail:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
    }
};


memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("updateMember");
        const input: MemberUpdateInput = req.body;
        if (req.file) input.memberImage = req.file.path.replace(/\\/, "/");

        const result = await memberService.updateMember(req.member, input);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, updateMember: ", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

memberController.getTopUsers = async (req: Request, res: Response) => {
    try {
        console.log("getTopUsers");
        const result = await memberService.getTopUsers();
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getTopUsers: ", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

// MIDDLEWARE: requires a valid token — sets req.member and passes to the next handler, or responds 401
memberController.verifyAuth = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction, // the next handler in the route chain
) => {
    try {
        const token = req.cookies["accessToken"]; // grab the JWT from the browser cookie (needs cookie-parser)
        if (token) req.member = await authService.checkAuth(token); // verify + decode, attach the member to the request

        if (!req.member)
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED); // no/invalid token: block the request

        next(); // token is valid: continue to the actual route handler
    } catch (err) {
        console.log("Error, verifyAuth:", err); // log the real error for debugging
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
    }
};

// MIDDLEWARE: optional auth — sets req.member if a valid token exists, but never blocks the request
memberController.retrieveAuth = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction, // the next handler in the route chain
) => {
    try {
        const token = req.cookies["accessToken"]; // grab the JWT from the browser cookie
        if (token) req.member = await authService.checkAuth(token); // attach the member if the token is valid
        next(); // continue either way
    } catch (err) {
        console.log("Error, retrieveAuth:", err); // log, but don't block
        next(); // continue even if the token was invalid (guest access)
    }
};

export default memberController; // exported so router.ts can use these handlers
