import express from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';


// Admin panel routes
routerAdmin.get('/', restaurantController.goHome);

routerAdmin.get('/login', restaurantController.getLogin).post('/login', restaurantController.processLogin);

routerAdmin.get('/signup', restaurantController.getSignup).post('/signup', restaurantController.processSignup);

// User management routes

//Product management routes
export default routerAdmin;