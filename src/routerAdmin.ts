// SSR admin panel routes, mounted at '/admin' in app.ts. Used by restaurant owners.
import express from 'express'; // web framework
const routerAdmin = express.Router(); // router instance for all /admin routes
import restaurantController from './controllers/restaurant.controller'; // handlers for login/signup/users
import productController from './controllers/product.controller'; // handlers for products
import makeUploader from './libs/utils/uploader'; // multer factory for file uploads

const uploadProductImage = makeUploader('products'); // saves product images to ./uploads/products

// Admin panel routes
routerAdmin.get('/', restaurantController.goHome); // admin home page

routerAdmin.get('/login', restaurantController.getLogin).post('/login', restaurantController.processLogin); // GET shows form, POST processes it

// signup: upload a single restaurant image (field name "memberImage") then create the account
routerAdmin.get('/signup', restaurantController.getSignup).post('/signup', makeUploader('members').single('memberImage'), restaurantController.processSignup);

routerAdmin.get('/logout', restaurantController.logout); // destroys the session

routerAdmin.get('/check-me', restaurantController.checkAuthSession); // quick check: who's currently logged in
// User management routes

//Product management routes
routerAdmin.get('/product/all', restaurantController.verifyRestaurant, productController.getAllProducts); // list all products, restaurant-only
// product create: upload up to 5 images (field name "productImages"), only restaurant owner allowed
routerAdmin.post('/product/create',
    restaurantController.verifyRestaurant, // must be logged in as restaurant
    uploadProductImage.array('productImages', 5), // handle up to 5 uploaded images
    productController.addNewProduct); // then create the product
routerAdmin.post('/product/:id', restaurantController.verifyRestaurant, productController.updateChosenProduct); // edit one product by id

routerAdmin.get("/user/all", restaurantController.verifyRestaurant, restaurantController.getUsers) // list all regular users

routerAdmin.post("/user/edit", restaurantController.verifyRestaurant, restaurantController.updateChosenUser) // update a user's status/info
export default routerAdmin; // exported so app.ts can mount it
