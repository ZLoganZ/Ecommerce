"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothe,
  electronic,
  furniture,
} = require("../models/product.model");

// define the product factory
class ProductFactory {
  static productRegistry = {};

  static registerProduct(type, productClass) {
    if (type === undefined || productClass === undefined) {
      throw new BadRequestError(`Error: Invalid product type ${type}!`);
    }

    ProductFactory.productRegistry[type] = productClass;
  }

  static async createProduct(type, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass)
      throw new BadRequestError(`Error: Invalid product type ${type}!`);

    return await new ProductClass(payload).createProduct();
    // switch (type) {
    //   case "Clothes":
    //     return await new Clothe(payload).createProduct();
    //   case "Electronics":
    //     return await new Electronic(payload).createProduct();
    //   case "Furniture":
    //     return await new Furniture(payload).createProduct();
    //   default:
    //     throw new BadRequestError(`Error: Invalid product type ${type}!`);
    // }
  }
}

// define the product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for clothes
class Clothe extends Product {
  async createProduct() {
    const newClothe = await clothe.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothe) throw new BadRequestError("Error: Cannot create clothe!");

    const newProduct = await super.createProduct(newClothe._id);
    if (!newProduct) throw new BadRequestError("Error: Cannot create product!");

    return newProduct;
  }
}

// define sub-class for electronics
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Error: Cannot create electronic!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Error: Cannot create product!");

    return newProduct;
  }
}

// define sub-class for furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Error: Cannot create furniture!");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Error: Cannot create product!");

    return newProduct;
  }
}

// register the product class
ProductFactory.registerProduct("Clothes", Clothe);
ProductFactory.registerProduct("Electronics", Electronic);
ProductFactory.registerProduct("Furnitures", Furniture);

module.exports = ProductFactory;
