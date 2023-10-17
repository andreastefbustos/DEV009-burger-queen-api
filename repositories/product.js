const { ObjectId } = require('mongodb');

class ProductRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async getAll() {
    const result = await this.collection.find({});
    return result.toArray();
  }

  async getById(id) {
    const objectId = new ObjectId(id);
    const result = await this.collection.findOne({ _id: objectId });
    return result;
  }

  async create(product) {
    const result = await this.collection.insertOne(product);
    return result.insertedId;
  }

  async update(id, update) {
    const objectId = new ObjectId(id);
    const updatedoc = { $set: { ...update } };
    const result = await this.collection.updateOne({ _id: objectId }, updatedoc);
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const objectId = new ObjectId(id);
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }
}

export default { ProductRepository };