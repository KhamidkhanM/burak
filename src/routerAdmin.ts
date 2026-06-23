// SSR admin panel routes, mounted at '/admin' in app.ts. Used by restaurant owners.
import express from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';
import productController from './controllers/product.controller';
import makeUploader from './libs/utils/uploader';

const uploadProductImage = makeUploader('products'); // saves product images to ./uploads/products

// Admin panel routes
routerAdmin.get('/', restaurantController.goHome); // admin home page

routerAdmin.get('/login', restaurantController.getLogin).post('/login', restaurantController.processLogin);

// signup: upload a single restaurant image (field name "memberImage") then create the account
routerAdmin.get('/signup', restaurantController.getSignup).post('/signup', makeUploader('members').single('memberImage'), restaurantController.processSignup);

routerAdmin.get('/logout', restaurantController.logout);

routerAdmin.get('/check-me', restaurantController.checkAuthSession); // quick check: who's currently logged in
// User management routes

//Product management routes
routerAdmin.get('/product/all', restaurantController.verifyRestaurant, productController.getAllProducts);
// product create: upload up to 5 images (field name "productImages"), only restaurant owner allowed
routerAdmin.post('/product/create',
    restaurantController.verifyRestaurant,
    uploadProductImage.array('productImages', 5),
    productController.addNewProduct);
routerAdmin.post('/product/:id', restaurantController.verifyRestaurant, productController.updateChosenProduct); // edit one product by id

routerAdmin.get("/user/all", restaurantController.verifyRestaurant, restaurantController.getUsers) // list all regular users

routerAdmin.post("/user/edit", restaurantController.verifyRestaurant, restaurantController.updateChosenUser) // update a user's status/info
export default routerAdmin;

