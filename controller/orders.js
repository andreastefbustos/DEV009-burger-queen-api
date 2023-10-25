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
    const userId = req.user.id;
    const { client, table, products } = req.body;

    try {
      const order = await orderRepo.create({
        userId, client, table, products,
      });
      return resp.status(201).json(order);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  putOrders: async (req, resp) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return resp.sendStatus(400);
    }

    const update = { status };

    if (status === 'ready') {
      update.dateProcessed = new Date();
    }

    try {
      const order = await orderRepo.updateStatus(orderId, update);

      if (!order) {
        return resp.sendStatus(404);
      }

      return resp.status(200).json(order);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  deleteOrders: async (req, resp) => {
    const { orderId } = req.params;

    try {
      const order = await orderRepo.delete(orderId);

      if (!order) {
        return resp.sendStatus(404);
      }

      return resp.status(200).json(order);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
};
