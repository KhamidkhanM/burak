import express from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';
import productController from './controllers/product.controller';
import makeUploader from './libs/utils/uploader';

const uploadProductImage = makeUploader('products');

// Admin panel routes
routerAdmin.get('/', restaurantController.goHome);

routerAdmin.get('/login', restaurantController.getLogin).post('/login', restaurantController.processLogin);

routerAdmin.get('/signup', makeUploader('members').array('memberImage'), restaurantController.getSignup).post('/signup', restaurantController.processSignup);

routerAdmin.get('/logout', restaurantController.logout);

routerAdmin.get('/check-me', restaurantController.checkAuthSession);
// User management routes

//Product management routes
routerAdmin.get('/product/all', restaurantController.verifyRestaurant, productController.getAllProducts);
routerAdmin.post('/product/create', 
    restaurantController.verifyRestaurant, 
    // uploadProductImage.single('productImage'),
    makeUploader('products').single('productImage'),
    productController.addNewProduct);
routerAdmin.put('/product/:id', restaurantController.verifyRestaurant, productController.updateChosenProduct);
export default routerAdmin;

