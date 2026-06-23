// Mongoose schema/model for the "products" collection (the restaurant menu items).
import mongoose, { Schema } from "mongoose";
import { ProductCollection, ProductSize, ProductStatus, ProductVolume } from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus, // PAUSE / PROCESS / DELETE
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection, // DISH / SALAD / DESSERT / DRINK / OTHER
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.NORMAL,
    },

    productVolume: {
      type: Number,
      enum: ProductVolume,
      default: ProductVolume.ONE,
    },

    productDesc: {
      type: String,
      required: true,
    },

    productImages: {
      type: [String], // file paths to uploaded product photos (up to 5)
      default: [],
    },

    productViews: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true } // updatedAt, createdAt
);

// prevents creating two products with the exact same name + size + volume combo
productSchema.index({ productName: 1, productSize: 1, productVolume: 1 }, {unique: true});

export default mongoose.model("Product", productSchema);