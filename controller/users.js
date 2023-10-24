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

    let user;

    if (uid.includes('@')) {
      user = await userRepo.getByEmail(uid);
    } else {
      user = await userRepo.getById(uid);
    }

    if (!user) {
      return resp.sendStatus(404);
    }

    return resp.json(user);
  },
  postUsers: async (req, resp) => {
    const { email, password, role } = req.body;

    try {
      const user = await userRepo.create({ email, password: bcrypt.hashSync(password, 10), role });
      return resp.status(201).json(user);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  putUsers: async (req, resp) => {
    const { uid } = req.params;
    const { email, password, role } = req.body;

    if (!email && !password && !role) {
      return resp.sendStatus(400);
    }

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
      let user;
      if (uid.includes('@')) {
        user = await userRepo.updateByEmail(uid, update);
      } else {
        user = await userRepo.updateById(uid, update);
      }

      if (!user) {
        return resp.sendStatus(404);
      }

      return resp.sendStatus(200);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
  deleteUsers: async (req, resp) => {
    const { uid } = req.params;

    try {
      let deleteUser;

      if (uid.includes('@')) {
        deleteUser = await userRepo.deleteByEmail(uid);
      } else {
        deleteUser = await userRepo.deleteById(uid);
      }

      if (!deleteUser) {
        return resp.sendStatus(404);
      }

      return resp.sendStatus(200);
    } catch (err) {
      return resp.status(400).json({ error: err.message });
    }
  },
};
