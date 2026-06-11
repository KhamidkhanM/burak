import express from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';
import productController from './controllers/product.controller';


// Admin panel routes
routerAdmin.get('/', restaurantController.goHome);

routerAdmin.get('/login', restaurantController.getLogin).post('/login', restaurantController.processLogin);

routerAdmin.get('/signup', restaurantController.getSignup).post('/signup', restaurantController.processSignup);

routerAdmin.get('/logout', restaurantController.logout);

routerAdmin.get('/check-me', restaurantController.checkAuthSession);
// User management routes

//Product management routes
routerAdmin.get('/product/all', restaurantController.verifyRestaurant, productController.getAllProducts);
routerAdmin.post('/product/create', restaurantController.verifyRestaurant, productController.addNewProduct);
routerAdmin.put('/product/:id', restaurantController.verifyRestaurant, productController.updateChosenProduct);
export default routerAdmin;

