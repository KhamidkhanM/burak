// Order controller — handles /order/* routes for the SPA (token-authenticated users).
import { T } from "../libs/types/common"; // generic object type
import Errors, { HttpCode } from "../libs/types/errors"; // custom error class + status codes
import { ExtendedRequest } from "../libs/types/member"; // request with req.member set by verifyAuth
import { Response } from "express"; // Express response type
import OrderService from "../models/Order.service"; // business logic for orders
import { OrderInquiry } from "../libs/types/order"; // query params shape for listing orders
import { OrderStatus } from "../libs/enums/order.enum"; // PAUSE / PROCESS / FINISH / DELETE

const orderService = new OrderService(); // single shared instance of the service
const orderController: T = {}; // plain object that holds all the route handler functions

// API create order: turns the basket (req.body) into an order for the logged-in member
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder"); // debug log
    const result = await orderService.createOrder(req.member, req.body); // req.member set by verifyAuth, body = basket items
    res.status(HttpCode.CREATED).json(result); // 201 + the created order
  } catch (err) {
    console.log("Error, createOrder:", err); // log the real error for debugging
    if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
    else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
  }
};

// API list my orders: paginated orders of the logged-in member, filtered by status
orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders"); // debug log
    const { page, limit, orderStatus } = req.query; // e.g. ?page=1&limit=5&orderStatus=PAUSE
    const inquiry: OrderInquiry = {
      page: Number(page), // string from the URL -> number
      limit: Number(limit), // string from the URL -> number
      orderStatus: orderStatus as OrderStatus, // string from the URL -> enum value
    };
    console.log("inquiry", inquiry); // debug log

    const result = await orderService.getMyOrders(req.member, inquiry); // req.member set by verifyAuth
    res.status(HttpCode.OK).json(result); // 200 + the orders (with items + products joined)
  } catch (err) {
    console.log("Error, getMyOrders:", err); // log the real error for debugging
    if (err instanceof Errors) res.status(err.code).json(err); // known error: use its status code
    else res.status(Errors.standard.code).json(Errors.standard); // unknown error: fall back to 500
  }
};

export default orderController; // exported so router.ts can use these handlers
