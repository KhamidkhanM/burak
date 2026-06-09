import { Request, Response} from 'express'
import { T } from '../libs/types/common';
import MemberService from '../models/member.service';
import { AdminRequest, MemberInput, LogInput } from '../libs/types/member';
import { MemberType } from '../libs/enums/member.enum';

const restaurantController: T = {};
restaurantController.goHome = function (req: Request, res: Response) {
    try {
        res.render('home');

    } catch (err) {
        console.log('Error in goHome:', err);
    }
};

restaurantController.getSignup = function (req: Request, res: Response) {
    try {
        res.render('signup');
    } catch (err) {
        console.log('Error in getSignup:', err);
    }
};

restaurantController.getLogin = function (req: Request, res: Response) {
    try {
        res.render('login');
    } catch (err) {
        console.log('Error in getLogin:', err);
    }
};

restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup");
        console.log("body:", req.body);

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTAURANT;

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);
        res.send(result);
        //TODO: Sessions authentication

        req.session.member = result;
        req.session.save(function(){
        res.send(result);
    });

    } catch (err) {
        console.log("Error, processSignup:", err);
        res.send(err);
    }
};

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
        res.send(result);
    });
        
        
        // res.send("DONE");
    } catch (err) {
        console.log("Error, processLogin:", err);
        res.send(err);
    }
};



export default restaurantController;