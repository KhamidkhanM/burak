// Business logic for orders: creating an order from the basket items.
// Writes to two collections: "orders" (the total) and "orderItems" (each product line).
import { ObjectId } from "mongoose"; // Mongo's document id type
import { shapeIntoMongooseObjectId } from "../libs/config"; // string -> ObjectId helper
import Errors, { HttpCode, Message } from "../libs/types/errors"; // custom error class + codes/messages
import { Member } from "../libs/types/member"; // the logged-in member placing the order
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order"; // typed shapes
import OrderModel from "../schema/Order.model"; // the "orders" Mongoose model
import OrderItemModel from "../schema/OrderItem.model"; // the "orderItems" Mongoose model
import { OrderStatus } from "../libs/enums/order.enum"; // PAUSE / PROCESS / FINISH / DELETE
import MemberService from "./member.service"; // used to award points when an order is paid

class OrderService {
  private readonly orderModel; // reference to the orders model
  private readonly orderItemModel; // reference to the orderItems model
  private readonly memberService; // member business logic (for addUserPoint)

  constructor() {
    this.orderModel = OrderModel; // assign so methods can use `this.orderModel`
    this.orderItemModel = OrderItemModel; // assign so methods can use `this.orderItemModel`
    this.memberService = new MemberService(); // own instance of the member service
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

  // lists the logged-in member's orders (paginated, filtered by status), with items + products joined in
  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry,
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id); // the id from the token, made into an ObjectId
    const matches = { memberId: memberId, orderStatus: inquiry.orderStatus }; // only MY orders in the requested state

    const result = await this.orderModel
      .aggregate([ // aggregation pipeline: each stage transforms the previous stage's output
        { $match: matches }, // 1) keep only this member's orders with the wanted status
        { $sort: { updatedAt: -1 } }, // 2) newest orders first
        { $skip: (inquiry.page - 1) * inquiry.limit }, // 3) skip past earlier pages
        { $limit: inquiry.limit }, // 4) take one page's worth
        {
          $lookup: { // 5) join: pull in this order's item lines
            from: "orderItems", // the collection to join with
            localField: "_id", // order's _id ...
            foreignField: "orderId", // ... matches orderItems.orderId
            as: "orderItems", // attach the matches as an array field
          },
        },
        {
          $lookup: { // 6) join: pull in the actual product documents for those lines
            from: "products", // the collection to join with
            localField: "orderItems.productId", // the product ids inside the joined lines
            foreignField: "_id", // ... match against products._id
            as: "productData", // attach as an array field
          },
        },
      ])
      .exec(); // run the pipeline
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // safety check

    return result; // orders, each carrying its orderItems + productData
  }

  // changes an order's status (e.g. PAUSE -> PROCESS when the member pays)
  public async updateOrder(
    member: Member,
    input: OrderUpdateInput,
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id), // who is asking
      orderId = shapeIntoMongooseObjectId(input.orderId), // which order
      orderStatus = input.orderStatus; // the new status

    const result = await this.orderModel
      .findOneAndUpdate(
        {
          memberId: memberId, // the order must belong to this member (can't touch others' orders)
          _id: orderId, // and match the requested id
        },
        { orderStatus: orderStatus }, // apply the new status
        { new: true }, // return the updated document
      )
      .exec(); // run the query
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED); // not found / not theirs

    // paying an order (moving it to PROCESS) rewards the member with 1 loyalty point
    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(member, 1);
    }

    return result; // hand the updated order back
  }
}

export default OrderService; // exported so controllers can `new OrderService()`
