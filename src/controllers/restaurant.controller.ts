import { Request, Response} from 'express'
import { T } from '../libs/types/common';
import MemberService from '../models/member.service';

const restaurantController: T = {};
restaurantController.goHome = function (req: Request, res: Response) {
    try {
        res.send('Home Page');
    } catch (err) {
        console.log('Error in goHome:', err);
    }
};

restaurantController.getSignup = function (req: Request, res: Response) {
    try {
        res.send('Signup Page');
    } catch (err) {
        console.log('Error in getSignup:', err);
    }
};

restaurantController.getLogin = function (req: Request, res: Response) {
    try {
        res.send('Login Page');
    } catch (err) {
        console.log('Error in getLogin:', err);
    }
};

export default restaurantController;