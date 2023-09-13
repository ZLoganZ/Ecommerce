'use strict';

const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothe,
  electronic,
  furniture
} = require('../models/product.model');
const InventoryRepository = require('../models/repositories/inventory.repo');
const ProductRepository = require('../models/repositories/product.repo');
const { removeUndefined, updateNestedObject } = require('../utils');

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
  }

  static async updateProduct(type, product_id, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass)
      throw new BadRequestError(`Error: Invalid product type ${type}!`);

    return await new ProductClass(payload).updateProduct({ product_id });
  }

  static async findAllDraftProductsForShop({
    product_shop,
    limit = 50,
    skip = 0
  }) {
    const query = { product_shop, isDraft: true };
    return await ProductRepository.queryAllProductsForShop({
      query,
      limit,
      skip
    });
  }

  static async findAllPublishedProductsForShop({
    product_shop,
    limit = 50,
    skip = 0
  }) {
    const query = { product_shop, isPublished: true };
    return await ProductRepository.queryAllProductsForShop({
      query,
      limit,
      skip
    });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.publishProductByShop({
      product_shop,
      product_id
    });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.unPublishProductByShop({
      product_shop,
      product_id
    });
  }

  static async searchProducts({ keySearch }) {
    return await ProductRepository.searchProducts({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true }
  }) {
    return await ProductRepository.findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_thumb', 'product_price']
    });
  }

  static async findProduct({ product_id }) {
    return await ProductRepository.findProduct({
      product_id,
      unSelect: ['__v']
    });
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
    product_attributes
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
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await InventoryRepository.insertInventory({
        product_id: newProduct._id,
        shop_id: this.product_shop,
        stock: this.product_quantity
      });
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    return await ProductRepository.updateProduct({
      product_id,
      payload,
      model: product
    });
  }
}

// define sub-class for clothes
class Clothe extends Product {
  async createProduct() {
    const newClothe = await clothe.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothe) throw new BadRequestError('Error: Cannot create clothe!');

    const newProduct = await super.createProduct(newClothe._id);
    if (!newProduct) throw new BadRequestError('Error: Cannot create product!');

    return newProduct;
  }

  async updateProduct({ product_id }) {
    const objectParams = removeUndefined(this);

    if (objectParams.product_attributes) {
      await ProductRepository.updateProduct({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: clothe
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );

    return updateProduct;
  }
}

// define sub-class for electronics
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic)
      throw new BadRequestError('Error: Cannot create electronic!');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Error: Cannot create product!');

    return newProduct;
  }

  async updateProduct({ product_id }) {
    const objectParams = removeUndefined(this);

    if (objectParams.product_attributes) {
      await ProductRepository.updateProduct({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: electronic
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );

    return updateProduct;
  }
}

// define sub-class for furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture)
      throw new BadRequestError('Error: Cannot create furniture!');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Error: Cannot create product!');

    return newProduct;
  }

  async updateProduct({ product_id }) {
    const objectParams = removeUndefined(this);

    if (objectParams.product_attributes) {
      await ProductRepository.updateProduct({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: furniture
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );

    return updateProduct;
  }
}

// register the product class
ProductFactory.registerProduct('Clothes', Clothe);
ProductFactory.registerProduct('Electronics', Electronic);
ProductFactory.registerProduct('Furnitures', Furniture);

module.exports = ProductFactory;
