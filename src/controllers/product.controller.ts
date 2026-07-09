// Product controller — handles /admin/product/* routes (restaurant menu management).
import { Request, Response } from 'express'; // Express types
import { T } from '../libs/types/common'; // generic object type
import Errors, { HttpCode, Message } from '../libs/types/errors'; // custom error class + codes/messages
import { Product, ProductInput, ProductInquiry } from '../libs/types/product'; // typed product input shape
import { AdminRequest, ExtendedRequest } from '../libs/types/member'; // typed request with session/files
import productService from '../models/product.service'; // business logic for products
import { ProductCollection } from '../libs/enums/product.enum';
const productController: T = {}; // plain object that holds all the route handler functions

/** SPA */
productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts"); // debug log
        const { page, limit, order, productCollection, search } = req.query; // no query params expected for now
        const inquiry: ProductInquiry = {
            order: String(order), // default to ascending order
            page: Number(page), // default to page 1
            limit: Number(limit), // default to 10 items per page
        }
        if (productCollection) {
            inquiry.productCollection = productCollection as ProductCollection;
        }
        if (search) {
            inquiry.search = String(search);
        }
        const result = await productService.getProducts(inquiry); // fetch products from MongoDB based on the inquiry
        res.status(HttpCode.OK).json(result); // fetch all products from MongoDB and return as JSON

    } catch (err) {
        console.log("Error, getProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
        // res.json({ });
    }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getProduct");
        const { id } = req.params;
        const memberId = req.member?._id ?? null,
            result = await productService.getProduct(memberId, String(id)); // fetch the product by id from MongoDB

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};


/** SSR */

// fetches every product and renders the restaurant menu page
productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts"); // debug log
        const data = await productService.getAllProducts(); // fetch all products from MongoDB
        // console.log("products:", data)

        res.render('products', { products: data }); // render views/products.ejs with the list
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
        // res.json({ });
    }
};

// creates a new product with up to 5 uploaded images (only restaurant owners, via verifyRestaurant)
productController.addNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("addNewProduct"); // debug log
        console.log("req.files", req.files); // debug log of uploaded files
        console.log("req.body:", req.body) // debug log of submitted form fields

        if (!req.files?.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED); // no images uploaded

        const files = req.files as Express.Multer.File[]; // cast multer's uploaded files
        const data: ProductInput = req.body; // form fields cast to the expected shape
        // form values arrive lowercase from the <select> options, so normalize to match the enums
        if (data.productCollection) data.productCollection = (data.productCollection as string).toUpperCase() as any; // e.g. "dish" -> "DISH"
        if (data.productSize) data.productSize = (data.productSize as string).toUpperCase() as any; // e.g. "small" -> "SMALL"
        if (data.productStatus) data.productStatus = (data.productStatus as string).toUpperCase() as any; // e.g. "pause" -> "PAUSE"
        data.productImages = files.map(ele => ele.path.replace(/\\/g, '/')); // normalize Windows-style path slashes

        await productService.createNewProduct(data); // insert the new product into MongoDB
        res.send(`<script> alert('Success'); window.location.replace('/admin/product/all') </script>`); // show success and redirect

        // console.log("data", data);
        // res.send("Done!");

    } catch (err) {
        console.log("Error, addNewProduct:", err); // log the real error for debugging
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; // pick the right message
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`); // show alert and redirect back
    }
};

// updates one product (e.g. status change PAUSE/PROCESS/DELETE) by its id
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct"); // debug log
        const id = req.params.id as string; // product id comes from the URL (/product/:id)

        const result = await productService.updateChosenProduct(id, req.body) // apply the update in MongoDB

        res.status(HttpCode.OK).json({ data: result }); // respond with the updated product
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
        else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
        // res.json({ });
    }
};

export default productController; // exported so routerAdmin.ts can use these handlers
