/* eslint-disable*/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    enum: ['admin', 'waiter', 'chef'],
  },
});

class UserRepository {
  constructor() {
    this.model = mongoose.model('User', userSchema);
  }

  async getAll() {
    const result = await this.model.find({});
    return result;
  }

  async getById(id) {
    const result = await this.model.findById(id);
    return result;
  }

  async getByEmail(email) {
    const result = await this.model.findOne({ email });
    return result;
  }

  async create(user) {
    const result = await this.model.create(user);
    return result;
  }

  async updateById(id, update) {
    const result = await this.model.findByIdAndUpdate({ _id: id }, update, {new: true, runValidators: true});
    return result;
  }

  async updateByEmail(email, update) {
    const result = await this.model.findOneAndUpdate({ email: email }, update, {new: true, runValidators: true});
    return result;
  }

  async deleteById(id) {
    const result = await this.model.findOneAndDelete({ _id: id });
    return result;
  }

  async deleteByEmail(email) {
    const result = await this.model.findOneAndDelete({ email: email });
    return result;
  }
}

module.exports = { UserRepository };
