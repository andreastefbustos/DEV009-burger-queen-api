/* eslint-disable*/
const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema(
  {
    qty: {
      type: Number,
      require: true,
    },
    product: {
      id: { type: String },
      name: { type: String },
      price: Number,
      image: { type: String },
      type: { type: String },
      dateEntry: Date,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  client: {
    type: String,
    required: [true, 'Please provide a client`s name'],
  },
  table: {
    type: String,
    required: true,
  },
  products: {
    type: [productOrderSchema],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'canceled', 'delivering', 'delivered'],
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: {
    type: Date,
  },
});

class OrderRepository {
  constructor() {
    this.model = mongoose.model('Order', orderSchema);
  }

  async getAll() {
    const result = await this.model.find({});
    return result;
  }

  async getById(id) {
    const result = await this.model.findById(id);
    return result;
  }

  async create(order) {
    const result = await this.model.create(order);
    return result;
  }

  async updateStatus(id, status) {
    const result = await this.model.updateOne({ _id: id }, status);
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

module.exports = { OrderRepository };
