"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_description: String,
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothes", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const clotheSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    color: String,
    model: String,
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "Furnitures",
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothe: model("Clothe", clotheSchema),
  electronic: model("Electronic", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
