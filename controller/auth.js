const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { UserRepository } = require('../repositories/user');

module.exports = {
  login: async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    const userRepo = new UserRepository();
    const user = await userRepo.getByEmail(email);

    if (!user) {
      return resp.status(400).json({ err: 'Invalid credentials' });
    }

    // compare password
    if (!bcrypt.compareSync(password, user.password)) {
      return resp.status(400).json({ err: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '3600s' });
    return resp.json({ token });
  },
};
