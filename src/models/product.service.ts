import productModel from "../schema/product.model";


class productService {
    private readonly productModel;
    
    constructor() {
        this.productModel = productModel;
    }
}

export default new productService();