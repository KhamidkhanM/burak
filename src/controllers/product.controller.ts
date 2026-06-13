import { Request, Response } from 'express';
import { T } from '../libs/types/common';
import Errors, { HttpCode, Message } from '../libs/types/errors';
import { ProductInput } from '../libs/types/product';
import { AdminRequest } from '../libs/types/member';
import productService from '../models/product.service';
const productController: T = {};

/** SPA */

  /** SSR */

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        res.render('products');
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        // res.json({ });
    }
};

productController.addNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("addNewProduct");
        console.log("req.files", req.files);

        if (!req.files?.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

        const files = req.files as Express.Multer.File[];
        const data: ProductInput = req.body;
        if (data.productCollection) data.productCollection = (data.productCollection as string).toUpperCase() as any;
        if (data.productSize) data.productSize = (data.productSize as string).toUpperCase() as any;
        if (data.productStatus) data.productStatus = (data.productStatus as string).toUpperCase() as any;
        data.productImages = files.map(ele => ele.path.replace(/\\/g, '/'));

        await productService.createNewProduct(data);
        res.send(`<script> alert('Success'); window.location.replace('/admin/product/all') </script>`);

        // console.log("data", data);
        // res.send("Done!");

    } catch (err) {
        console.log("Error, addNewProduct:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert(${Message}); window.location.replace('/admin/product/all') </script>`);
    }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct");
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
        // res.json({ });
    }
};

export default productController;