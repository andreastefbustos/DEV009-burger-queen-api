const bcrypt = require('bcrypt');
const { UserRepository } = require('../repositories/user');

const userRepo = new UserRepository();

module.exports = {
  getUsers: async (req, resp) => {
    const users = await userRepo.getAll();
    return resp.json(users);
  },
  getUserById: async (req, resp) => {
    const { uid } = req.params;
    const user = await userRepo.getById(uid);

    if (!user) {
      return resp.sendStatus(404);
    }

    return resp.json(user);
  },
  postUsers: async (req, resp) => {
    const { email, password, role } = req.body;

    try {
      await userRepo.create({ email, password: bcrypt.hashSync(password, 10), role });
      return resp.sendStatus(201);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  putUsers: async (req, resp) => {
    const { uid } = req.params;
    const { email, password, role } = req.body;

    const update = {};

    if (email) {
      update.email = email;
    }

    if (password) {
      update.password = bcrypt.hashSync(password, 10);
    }

    if (role) {
      update.role = role;
    }

    try {
      await userRepo.update(uid, update);
      return resp.sendStatus(200);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  deleteUsers: async (req, resp) => {
    const { uid } = req.params;

    try {
      await userRepo.delete(uid);
      return resp.sendStatus(200);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
};
