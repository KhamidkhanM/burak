// Business logic for products (the restaurant menu): list, create, update.
// Talks to MongoDB through productModel; controllers call these methods, never the DB directly.
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/types/errors";
import { Product, ProductInput } from "../libs/types/product";
import productModel from "../schema/product.model";


class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = productModel;
  }

  /** SPA */

  /** SSR */
  // returns every product in the menu
  public async getAllProducts(): Promise<Product[]> {

    const result = await this.productModel.find().exec();
    if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)

    return result;
  }

  // inserts a new product document
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // updates one product by id (e.g. changing its status)
  public async updateChosenProduct(
    id: string,
    input: ProductInput): Promise<Product> {
    id = shapeIntoMongooseObjectId(id); // convert string id from the URL param into a real ObjectId
    const result = await this.productModel.findOneAndUpdate({ _id: id}, input, {new: true}).exec();
    if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED)

    return result;
  }
}

export default new ProductService();
