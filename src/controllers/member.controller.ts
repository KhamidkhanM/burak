import { Request, Response} from 'express'
import { T } from '../libs/types/common';

const memberController: T = {};
memberController.goHome = function (req: Request, res: Response) {
    try {
        res.send('Home Page');
    } catch (err) {
        console.log('Error in goHome:', err);
    }
};

memberController.getSignup = function (req: Request, res: Response) {
    try {
        res.send('Signup Page');
    } catch (err) {
        console.log('Error in getSignup:', err);
    }
};

memberController.getLogin = function (req: Request, res: Response) {
    try {
        res.send('Login Page');
    } catch (err) {
        console.log('Error in getLogin:', err);
    }
};

export default memberController;