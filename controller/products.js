const { ProductRepository } = require('../repositories/product');

const productRepo = new ProductRepository();

module.exports = {
  getProducts: async (req, resp) => {
    const products = await productRepo.getAll();
    return resp.json(products);
  },
  getProductById: async (req, resp) => {
    const { productId } = req.params;
    const product = await productRepo.getById(productId);

    if (!product) {
      return resp.sendStatus(404);
    }

    return resp.json(product);
  },
  postProducts: async (req, resp) => {
    const {
      name, price, image, type,
    } = req.body;

    try {
      const product = await productRepo.create({
        name, price, image, type,
      });
      return resp.status(201).json(product);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  putProducts: async (req, resp) => {
    const { productId } = req.params;
    const {
      name, price, image, type,
    } = req.body;

    const update = {};

    if (name) {
      update.name = name;
    }

    if (price) {
      update.price = price;
    }

    if (image) {
      update.image = image;
    }

    if (type) {
      update.type = type;
    }

    try {
      const product = await productRepo.update(productId, update);

      if (!product) {
        return resp.sendStatus(404);
      }

      return resp.status(200).json(product);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  deleteProducts: async (req, resp) => {
    const { productId } = req.params;

    try {
      const product = await productRepo.delete(productId);

      if (!product) {
        return resp.sendStatus(404);
      }

      return resp.status(200).json(product);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
};
