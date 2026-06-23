// Business logic for products (the restaurant menu): list, create, update.
// Talks to MongoDB through productModel; controllers call these methods, never the DB directly.
import { shapeIntoMongooseObjectId } from "../libs/config"; // string -> ObjectId helper
import Errors, { HttpCode, Message } from "../libs/types/errors"; // custom error class + codes/messages
import { Product, ProductInput } from "../libs/types/product"; // typed shapes
import productModel from "../schema/product.model"; // the Mongoose model/collection


class ProductService {
  private readonly productModel; // reference to the Mongoose model, set once in the constructor

  constructor() {
    this.productModel = productModel; // assign the imported model so methods can use `this.productModel`
  }

  /** SPA */

  /** SSR */
  // returns every product in the menu
  public async getAllProducts(): Promise<Product[]> {

    const result = await this.productModel.find().exec(); // fetch every product document
    if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND) // safety check

    return result;
  }

  // inserts a new product document
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input); // insert and return the new product
    } catch (err) {
      console.error("Error, model:createNewProduct:", err); // log the real DB error
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // report a friendly error instead
    }
  }

  // updates one product by id (e.g. changing its status)
  public async updateChosenProduct(
    id: string,
    input: ProductInput): Promise<Product> {
    id = shapeIntoMongooseObjectId(id); // convert string id from the URL param into a real ObjectId
    const result = await this.productModel.findOneAndUpdate({ _id: id}, input, {new: true}).exec(); // {new:true} returns the updated doc
    if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED) // no document found to update

    return result;
  }
}

export default new ProductService(); // exported as a ready-to-use singleton instance
