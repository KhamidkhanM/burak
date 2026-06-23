// SSR admin (restaurant owner) controller — handles requests for /admin/* routes.
import { NextFunction, Request, Response} from 'express'
import { T } from '../libs/types/common';
import MemberService from '../models/member.service';
import { AdminRequest, MemberInput, LogInput } from '../libs/types/member';
import { MemberStatus, MemberType } from '../libs/enums/member.enum';
import Errors, { HttpCode, Message } from '../libs/types/errors';

const restaurantController: T = {};

// renders the admin home/landing page
restaurantController.goHome = function (req: Request, res: Response) {
    try {
        res.render('home');

    } catch (err) {
        console.log('Error in goHome:', err);
        res.redirect('/admin');
    }
};

// shows the signup form page
restaurantController.getSignup = function (req: Request, res: Response) {
    try {
        res.render('signup');
    } catch (err) {
        console.log('Error in getSignup:', err);
        res.redirect('/admin');
    }
};

// shows the login form page
restaurantController.getLogin = function (req: Request, res: Response) {
    try {
        res.render('login');
    } catch (err) {
        console.log('Error in getLogin:', err);
        res.redirect('/admin');
    }
};

// handles the signup form submission: creates a new RESTAURANT member with an uploaded image
restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup");
        console.log("body:", req.body);
        const file = req.file; // uploaded restaurant image, set by multer
        if (!file)
            throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path.replace(/\\/g, '/'); // normalize Windows-style path slashes
        newMember.memberType = MemberType.RESTAURANT;

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);

        req.session.member = result; // log the new member in right away
        req.session.save(function(){
        res.redirect("/admin/product/all");
    });

    } catch (err) {
        console.log("Error, processSignup:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/signup') </script>`);
    }
};

// handles the login form submission: verifies credentials and starts a session
restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);
        const input: LogInput = req.body;


        const memberService = new MemberService();
        const result = await memberService.processLogin(input)
        //TODO: Sessions authentication

        req.session.member = result;
        req.session.save(function(){
        res.redirect("/admin/product/all");
    });
    } catch (err) {
        console.log("Error, processLogin:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`);
    }
};

// clears the session (logout)
restaurantController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);
        req.session.destroy(function() {
            res.redirect('/admin');
        });
    } catch (err) {
        console.log("Error, Logout:", err);
        console.log("Error, processLogin:", err);
        res.redirect('/admin');


    }
};

// fetches all regular (non-restaurant) users and renders the user-management page
restaurantController.getUsers = async (req: Request, res: Response) => {
    try {
        const memberService = new MemberService();
        const result = await memberService.getUsers();

        res.render("users", {users: result});
    } catch (err) {
        console.log('Error in getUsers:', err);
        res.redirect('/admin/login');
    }
};

// updates a single user (e.g. block/unblock) and returns the updated record as JSON
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        const memberService = new MemberService();
        const result = await memberService.updateChosenUser(req.body);

        res.status(HttpCode.OK).json({data: result});
    } catch (err) {
        console.log('Error in updateChosenUser:', err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

// simple endpoint to check who (if anyone) is currently logged in via session
restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member) res.send(`Hi, ${req.session.member.memberNick}`);
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.send(err);
  }
};

// middleware: blocks access to admin-only routes unless the session belongs to a RESTAURANT member
restaurantController.verifyRestaurant = (req: AdminRequest, res: Response, next: NextFunction) => {
    if (req.session?.member?.memberType === MemberType.RESTAURANT) {
        req.member = req.session.member;
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`);
        }
}

export default restaurantController;
