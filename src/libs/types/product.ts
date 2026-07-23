// TypeScript shapes for product-related data, used across controllers/services for type safety.
import { ObjectId } from "mongoose"; // Mongo's document id type
import {
  ProductCollection, // menu category enum
  ProductSize, // dish size enum
  ProductStatus, // lifecycle status enum
} from "../enums/product.enum";

// a full product document as stored/returned from MongoDB
export interface Product {
  _id: ObjectId; // Mongo document id
  productStatus: ProductStatus; // PAUSE / PROCESS / DELETE
  productCollection: ProductCollection; // DISH / SALAD / DESSERT / DRINK / OTHER
  productName: string; // dish/drink name
  productPrice: number; // price
  productLeftCount: number; // stock count
  productSize: ProductSize; // SMALL / NORMAL / LARGE / SET
  productVolume: number; // liters, only relevant for DRINK
  productDesc?: string; // optional description
  productImages: string[]; // list of image filenames
  productViews: number; // view counter
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}

// fields required/allowed when creating a new product
export interface ProductInput {
  productStatus?: ProductStatus; // defaults in schema if not given
  productCollection: ProductCollection; // required category
  productName: string; // required name
  productPrice: number; // required price
  productLeftCount: number; // required stock count
  productSize?: ProductSize; // optional size
  productVolume?: number; // optional volume
  productDesc?: string; // optional description
  productImages?: string[]; // optional images
  productViews?: number; // optional, defaults to 0
}

// fields allowed when editing an existing product (_id is required, everything else optional)
export interface ProductUpdateInput {
  _id: ObjectId; // which product to update
  productStatus?: ProductStatus; // e.g. pause/delete
  productCollection?: ProductCollection; // change category
  productName?: string; // change name
  productPrice?: number; // change price
  productLeftCount?: number; // change stock
  productSize?: ProductSize; // change size
  productVolume?: number; // change volume
  productDesc?: string; // change description
  productImages?: string[]; // change images
  productViews?: number; // change view count
}
