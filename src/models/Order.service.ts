// Business logic for orders: creating an order from the basket items.
// Writes to two collections: "orders" (the total) and "orderItems" (each product line).
import { ObjectId } from "mongoose"; // Mongo's document id type
import { shapeIntoMongooseObjectId } from "../libs/config"; // string -> ObjectId helper
import Errors, { HttpCode, Message } from "../libs/types/errors"; // custom error class + codes/messages
import { Member } from "../libs/types/member"; // the logged-in member placing the order
import { Order, OrderItemInput } from "../libs/types/order"; // typed shapes
import OrderModel from "../schema/Order.model"; // the "orders" Mongoose model
import OrderItemModel from "../schema/OrderItem.model"; // the "orderItems" Mongoose model

class OrderService {
  private readonly orderModel; // reference to the orders model
  private readonly orderItemModel; // reference to the orderItems model

  constructor() {
    this.orderModel = OrderModel; // assign so methods can use `this.orderModel`
    this.orderItemModel = OrderItemModel; // assign so methods can use `this.orderItemModel`
  }

  // creates a new order for the logged-in member from a list of basket items
  public async createOrder(
    member: Member,
    input: OrderItemInput[], // the basket: one entry per product
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id); // the id from the token, made into an ObjectId

    // sum up the basket: price * quantity for each item, starting from 0
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity; // add this line's cost to the running total
    }, 0);
    const delivery = amount < 100 ? 5 : 0; // small orders pay a $5 delivery fee, big ones are free

    try {
      const newOrder: Order = await this.orderModel.create({ // insert the order document
        orderTotal: amount + delivery, // items + delivery = what the member pays
        orderDelivery: delivery, // store the fee separately too
        memberId: memberId, // who ordered
      });

      const orderId = (newOrder as any)._id; // grab the new order's id for the item lines
      console.log("orderId:", orderId); // debug log
      await this.recordOrderItem(orderId, input); // save each basket line, linked to this order

      return newOrder; // hand the created order back to the controller
    } catch (err) {
      console.log("Error, model:createOrder:", err); // log the real DB error
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // report a friendly error instead
    }
  }

  // inserts one orderItems document per basket line, all linked to the given order
  private async recordOrderItem(
    orderId: ObjectId,
    input: OrderItemInput[],
  ): Promise<void> {
    const promisedList = input.map(async (item: OrderItemInput) => { // start an insert for every item
      item.orderId = orderId; // link this line to the parent order
      item.productId = shapeIntoMongooseObjectId(item.productId); // make sure the product id is a real ObjectId
      await this.orderItemModel.create(item); // insert the line document
      return "INSERTED"; // marker value for the log below
    });

    const orderItemsState = await Promise.all(promisedList); // wait until ALL inserts finish
    console.log("orderItemsState:", orderItemsState); // debug log, e.g. ["INSERTED", "INSERTED"]
  }
}

export default OrderService; // exported so controllers can `new OrderService()`
