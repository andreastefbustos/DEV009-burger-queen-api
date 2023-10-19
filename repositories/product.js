/* eslint-disable*/
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Product must have a price'],
    min: [1, 'Price must be at least 1'],
  },
  image: {
    type: String,
    required: [true, 'Product must have an image'],
  },
  type: {
    type: String,
    required: [true, 'Pproduct must have a type'],
    enum: {
      values: ['Desayuno', 'Almuerzo y Cena', 'Bebida'],
      message: 'Type must be either Desayuno, Almuerzo y Cena or Bebida',
    },
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
});

class ProductRepository {
  constructor() {
    this.model = mongoose.model('Product', productSchema);
  }

  async getAll() {
    const result = await this.model.find({});
    return result;
  }

  async getById(id) {
    const result = await this.model.findById(id);
    return result;
  }

  async create(product) {
    const result = await this.model.create(product);
    return result;
  }

  async update(id, update) {
    const result = await this.model.updateOne({ _id: id }, update);
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

module.exports = { ProductRepository };
