// Mongoose schema/model for the "products" collection (the restaurant menu items).
import mongoose, { Schema } from "mongoose"; // Mongoose itself + Schema constructor
import { ProductCollection, ProductSize, ProductStatus, ProductVolume } from "../libs/enums/product.enum"; // allowed enum values

const productSchema = new Schema( // defines the shape/validation rules for product documents
  {
    productStatus: {
      type: String, // stored as a string
      enum: ProductStatus, // PAUSE / PROCESS / DELETE
      default: ProductStatus.PAUSE, // new products start paused
    },

    productCollection: {
      type: String, // stored as a string
      enum: ProductCollection, // DISH / SALAD / DESSERT / DRINK / OTHER
      required: true, // must be provided
    },

    productName: {
      type: String, // dish/drink name
      required: true, // must be provided
    },

    productPrice: {
      type: Number, // price
      required: true, // must be provided
    },

    productLeftCount: {
      type: Number, // stock count
      required: true, // must be provided
    },

    productSize: {
      type: String, // stored as a string
      enum: ProductSize, // SMALL / NORMAL / LARGE / SET
      default: ProductSize.NORMAL, // defaults to normal size
    },

    productVolume: {
      type: Number, // stored as a number (liters)
      enum: ProductVolume, // only valid liter values
      default: ProductVolume.ONE, // defaults to 1 liter
    },

    productDesc: {
      type: String, // description text
      required: true, // must be provided
    },

    productImages: {
      type: [String], // file paths to uploaded product photos (up to 5)
      default: [], // starts with no images
    },

    productViews: {
      type: Number, // view counter
      default: 0, // starts at zero
    },

  },
  { timestamps: true } // updatedAt, createdAt
);

// prevents creating two products with the exact same name + size + volume combo
productSchema.index({ productName: 1, productSize: 1, productVolume: 1 }, {unique: true});

export default mongoose.model("Product", productSchema); // registers the 'products' collection model
