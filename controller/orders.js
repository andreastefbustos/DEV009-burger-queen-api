const { OrderRepository } = require('../repositories/order');

const orderRepo = new OrderRepository();

module.exports = {
  getOrders: async (req, resp) => {
    const orders = await orderRepo.getAll();
    return resp.json(orders);
  },
  getOrderById: async (req, resp) => {
    const { orderId } = req.params;
    const order = await orderRepo.getById(orderId);

    if (!order) {
      return resp.sendStatus(404);
    }

    return resp.json(order);
  },
  postOrders: async (req, resp) => {
    const { client, table, products } = req.body;

    try {
      await orderRepo.create({ client, table, products });
      return resp.sendStatus(201);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  putOrders: async (req, resp) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const dateProcessed = new Date();
    const update = { status };

    if (status === 'delivered') {
      update.dateProcessed = dateProcessed;
    }

    try {
      await orderRepo.updateStatus(orderId, update);
      return resp.sendStatus(200);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  deleteOrders: async (req, resp) => {
    const { orderId } = req.params;

    try {
      await orderRepo.delete(orderId);
      return resp.sendStatus(200);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
};
