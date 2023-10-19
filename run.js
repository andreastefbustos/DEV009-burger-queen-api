const mongoose = require('mongoose');
const { ProductRepository } = require('./repositories/product');
const { UserRepository } = require('./repositories/user');
const { OrderRepository } = require('./repositories/order');

async function run() {
  mongoose.connect('mongodb://localhost:27017/queen');
  const database = mongoose.connection;

  database.on('error', (error) => {
    console.error(error);
  });

  database.once('connected', () => {
    console.info('Database Connected');
  });

  // PRODUCTS
  const productRepo = new ProductRepository();
  // console.info(await productRepo.getAll());

  // crear un product
  // try {
  //   const product = {
  //     name: 'Cafe',
  //     price: 2,
  //     image: 'imagen.png',
  //     type: 'Desayuno',
  //   };

  //   const result = await productRepo.create(product);
  //   console.info(result);
  // } catch (e) {
  //   console.error('error: ', e);
  // }

  // get by id
  // const result = await productRepo.getById('652f370e7ae01ed14e52ec5d');
  // console.info(result);

  // get all products
  // const result = await productRepo.getAll();
  // console.info(result);

  // update product
  // let result = await productRepo.getById('652f370e7ae01ed14e52ec5d');
  // console.info(result);
  // const updateResult = await productRepo.update('652f370e7ae01ed14e52ec5d', { price: 1500 });
  // console.info(updateResult);
  // result = await productRepo.getById('652f370e7ae01ed14e52ec5d');
  // console.info(result);

  // Delete product
  // const result = await productRepo.delete('652f370e7ae01ed14e52ec5d');
  // console.info(result);

  // USERS
  const userRepo = new UserRepository();

  // Create users
  // try {
  //   const user = {
  //     email: 'stef!gm.com',
  //     password: '123456',
  //     role: 'chef',
  //   };

  //   const result = await userRepo.create(user);
  //   console.info(result);
  // } catch (e) {
  //   console.error('error: ', e);
  // }

  // Get all users
  const result = await userRepo.getAll();
  console.info(result);

  // Get user by id
  // const result = await userRepo.getById('652f02b4fc557390bf05b36b');
  // console.info(result);

  // Get user by email
  // const result = await userRepo.getByEmail('anita.borg@systers.xyz');
  // console.info(result);

  // Update user
  // const result = await userRepo.update('652f02b4fc557390bf05b36b', { role: 'chef' });
  // const result = await userRepo.getById('652f02b4fc557390bf05b36b');
  // console.info(result);

  // Delete user
  // const result = await userRepo.delete('652efacc35a87b98540eecf6');
  // console.info(result);
  // const result = await userRepo.getAll();
  // console.info(result);

  // ORDERS
  // Create order
  const orderRepo = new OrderRepository();
  // try {
  //   const order = {
  //     client: 'douglas',
  //     table: '12',
  //     products: [
  //       {
  //         qty: 3,
  //         product: {
  //           name: 'cafe lux',
  //           price: 20,
  //           image: 'imagen.png',
  //           type: 'Desayuno',
  //         },
  //       },
  //       {
  //         qty: 1,
  //         product: {
  //           name: 'Pasta',
  //           price: 15,
  //           image: 'imagen.png',
  //           type: 'Almuerzo y Cena',
  //         },
  //       },
  //     ],
  //   };
  //   const result = await orderRepo.create(order);
  //   console.info(result);
  // } catch (e) {
  //   console.error('error: ', e);
  // }

  // Get all orders
  // const result = await orderRepo.getAll();
  // console.info(result);

  // Get by Id
  // const result = await orderRepo.getById('652ee78f6aab449013a7c668');
  // console.info(result);

  // Update order
  // const result = await orderRepo.updateStatus('6530aae86b8191dab593a4ac', 'delivered');
  // const result = await orderRepo.getById('6530aae86b8191dab593a4ac');
  // console.info(result);

  // Delete order
  // const result = await orderRepo.delete('6530a425c75ceabcaeca8f29');
  // console.info(result);
}

run().catch(console.info);
