// TypeScript shapes for order-related data, used across controllers/services for type safety.
import { ObjectId } from "mongoose"; // Mongo's document id type
import { OrderStatus } from "../enums/order.enum"; // PAUSE / PROCESS / FINISH / DELETE

// one line inside an order (a product + how many of it), as stored in "orderItems"
export interface OrderItem {
  _id: ObjectId; // Mongo document id
  itemQuantity: number; // how many of this product
  itemPrice: number; // price of one unit at order time
  orderId: ObjectId; // which order this line belongs to
  productId: ObjectId; // which product was ordered
  createdAt: Date; // auto-set by Mongoose timestamps
  updatedAt: Date; // auto-set by Mongoose timestamps
}

// a full order document as stored/returned from MongoDB
export interface Order {
  orderTotal: number; // items total + delivery fee
  orderDelivery: number; // delivery fee (0 if the order is big enough)
  orderStatus: OrderStatus; // current state of the order
  memberId: ObjectId; // who placed the order
  createdAt: Date; // auto-set by Mongoose timestamps
  updatedAt: Date; // auto-set by Mongoose timestamps
}

// what the frontend sends per basket item when creating an order
export interface OrderItemInput {
  itemQuantity: number; // how many
  itemPrice: number; // unit price
  productId: ObjectId; // which product
  orderId?: ObjectId; // filled in by the server after the order is created
}
