// SPA/API controller — handles requests from router.ts ('/' routes). Returns JSON, no EJS.
import { Request, Response} from 'express'
import { T } from '../libs/types/common';
import MemberService from '../models/member.service';
import { MemberInput, LogInput, Member } from '../libs/types/member';
import Errors from '../libs/types/errors';

const memberController: T = {};

const memberService = new MemberService();

// landing page (shared EJS view, but used here for the SPA entry point)
memberController.goHome = function (_req: Request, res: Response) {
    try {
        res.render('home');
    } catch (err) {
        console.log('Error in goHome:', err);
    }
};

// API signup: creates a regular USER account and returns it as JSON
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");


        const input: MemberInput = req.body;
        const result: Member = await memberService.signup(input);
        //TODO: Tokens

        res.json(result);
    } catch (err) {
        console.log("Error, signup:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        // res.json({ });
    }
};

// API login: checks credentials and returns the member as JSON (no session/token yet)
memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login");
        const input: LogInput = req.body;
        const result: Member = await memberService.login(input);
        //TODO: Tokens

        res.json(result);
        // res.send("DONE");
    } catch (err) {
        console.log("Error, login:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        // res.json({});
    }
};





export default memberController;