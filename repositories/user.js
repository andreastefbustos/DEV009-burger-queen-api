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
    lowercase: true,
    trim: true,
    minLength: [6, 'A user password must be at least 6 characters long'],
    select: false,
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

  async update(id, update) {
    const result = await this.model.updateOne({ _id: id }, update);
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

module.exports = { UserRepository };
