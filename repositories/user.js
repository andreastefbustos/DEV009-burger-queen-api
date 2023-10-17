/* eslint-disable*/
const { ObjectId } = require('mongodb');

class UserRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async getAll() {
    const result = await this.collection.find({});
    return result.toArray();
  }

  async getById(id) {
    const objectId = new ObjectId(id);
    const result = await this.collection.findOne({_id: objectId})
    return result;
  }

  async getByEmail(email) {
    const result = await this.collection.findOne({email: email})
    return result;
  }

  async create(user) {
    const result = await this.collection.insertOne(user);
    return result.insertedId;
  }

  async update(id, update) {
    const objectId = new ObjectId(id);
    const updateDoc = { $set: { ...update }};
    const result = await this.collection.updateOne({ _id: objectId}, updateDoc);
    return result.modifiedCount > 0
  }

  async delete(id) {
    const objectId = new ObjectId(id);
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }
}

export default { UserRepository };