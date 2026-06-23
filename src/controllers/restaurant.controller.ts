// SSR admin (restaurant owner) controller — handles requests for /admin/* routes.
import { NextFunction, Request, Response} from 'express' // Express types for typing req/res/next
import { T } from '../libs/types/common'; // generic object type
import MemberService from '../models/member.service'; // business logic for members
import { AdminRequest, MemberInput, LogInput } from '../libs/types/member'; // typed request/input shapes
import { MemberStatus, MemberType } from '../libs/enums/member.enum'; // member type/status enums
import Errors, { HttpCode, Message } from '../libs/types/errors'; // custom error class + codes/messages

const restaurantController: T = {}; // plain object that holds all the route handler functions

// renders the admin home/landing page
restaurantController.goHome = function (req: Request, res: Response) {
    try {
        res.render('home'); // renders views/home.ejs

    } catch (err) {
        console.log('Error in goHome:', err); // log unexpected error
        res.redirect('/admin'); // fall back to admin root
    }
};

// shows the signup form page
restaurantController.getSignup = function (req: Request, res: Response) {
    try {
        res.render('signup'); // renders views/signup.ejs
    } catch (err) {
        console.log('Error in getSignup:', err);
        res.redirect('/admin');
    }
};

// shows the login form page
restaurantController.getLogin = function (req: Request, res: Response) {
    try {
        res.render('login'); // renders views/login.ejs
    } catch (err) {
        console.log('Error in getLogin:', err);
        res.redirect('/admin');
    }
};

// handles the signup form submission: creates a new RESTAURANT member with an uploaded image
restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup"); // debug log
        console.log("body:", req.body); // debug log of submitted form fields
        const file = req.file; // uploaded restaurant image, set by multer
        if (!file) // no image was uploaded
            throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG); // stop and report error

        const newMember: MemberInput = req.body; // form fields cast to the expected shape
        newMember.memberImage = file?.path.replace(/\\/g, '/'); // normalize Windows-style path slashes
        newMember.memberType = MemberType.RESTAURANT; // mark this signup as a restaurant account

        const memberService = new MemberService(); // instantiate the service layer
        const result = await memberService.processSignup(newMember); // create the member in MongoDB

        req.session.member = result; // log the new member in right away
        req.session.save(function(){ // wait for the session to be persisted before redirecting
        res.redirect("/admin/product/all"); // send the new restaurant owner to their menu page
    });

    } catch (err) {
        console.log("Error, processSignup:", err); // log the real error for debugging
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; // pick the right message
        res.send(`<script> alert("${message}"); window.location.replace('/admin/signup') </script>`); // show alert and send back to signup
    }
};

// handles the login form submission: verifies credentials and starts a session
restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin"); // debug log
        console.log("body:", req.body); // debug log of submitted form fields
        const input: LogInput = req.body; // form fields cast to the login shape


        const memberService = new MemberService(); // instantiate the service layer
        const result = await memberService.processLogin(input) // verify nick/password against the DB
        //TODO: Sessions authentication

        req.session.member = result; // store the logged-in member in the session
        req.session.save(function(){ // wait for the session to be persisted before redirecting
        res.redirect("/admin/product/all"); // send the restaurant owner to their menu page
    });
    } catch (err) {
        console.log("Error, processLogin:", err); // log the real error for debugging
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; // pick the right message
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`); // show alert and send back to login
    }
};

// clears the session (logout)
restaurantController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin"); // (leftover debug log, should say "logout")
        console.log("body:", req.body);
        req.session.destroy(function() { // removes all session data (logs the member out)
            res.redirect('/admin'); // send back to the home page
        });
    } catch (err) {
        console.log("Error, Logout:", err);
        console.log("Error, processLogin:", err);
        res.redirect('/admin'); // still redirect even if something went wrong


    }
};

// fetches all regular (non-restaurant) users and renders the user-management page
restaurantController.getUsers = async (req: Request, res: Response) => {
    try {
        const memberService = new MemberService(); // instantiate the service layer
        const result = await memberService.getUsers(); // fetch all USER-type members

        res.render("users", {users: result}); // render views/users.ejs with the list
    } catch (err) {
        console.log('Error in getUsers:', err);
        res.redirect('/admin/login'); // if something fails, send back to login
    }
};

// updates a single user (e.g. block/unblock) and returns the updated record as JSON
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        const memberService = new MemberService(); // instantiate the service layer
        const result = await memberService.updateChosenUser(req.body); // apply the update

        res.status(HttpCode.OK).json({data: result}); // respond with the updated user
    } catch (err) {
        console.log('Error in updateChosenUser:', err);
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
    }
};

// simple endpoint to check who (if anyone) is currently logged in via session
restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("checkAuthSession"); // debug log
    if (req.session?.member) res.send(`Hi, ${req.session.member.memberNick}`); // logged in: greet by nickname
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`); // not logged in: show alert
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.send(err); // sends the raw error object back (debug-only behavior)
  }
};

// middleware: blocks access to admin-only routes unless the session belongs to a RESTAURANT member
restaurantController.verifyRestaurant = (req: AdminRequest, res: Response, next: NextFunction) => {
    if (req.session?.member?.memberType === MemberType.RESTAURANT) { // only restaurant accounts may pass
        req.member = req.session.member; // attach the member to the request for downstream handlers
        next(); // continue to the actual route handler
    } else {
        const message = Message.NOT_AUTHENTICATED // not logged in / wrong account type
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`); // show alert and redirect
        }
}

export default restaurantController; // exported so routerAdmin.ts can use these handlers
