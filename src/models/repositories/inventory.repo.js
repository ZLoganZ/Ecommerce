'use strict';

const { inventory } = require('../inventory.model');

class InventoryRepository {
  static async insertInventory({ product_id, shop_id, stock, location }) {
    return await inventory.create({
      inven_productId: product_id,
      inven_shopId: shop_id,
      inven_stock: stock,
      inven_location: location
    });
  }
}

module.exports = InventoryRepository;
