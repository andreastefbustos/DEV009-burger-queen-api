const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
} = process;

describe('POST /orders', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsTestUser('/orders', { method: 'POST', body: {} })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when empty items', () => (
    fetchAsTestUser('/orders', {
      method: 'POST',
      body: { products: [] },
    })
      .then((resp) => {
        expect(resp.status).toBe(400);
      })
  ));

  it('should create order as user (own order)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 0',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client',
          table: '2',
          products: [
            {
              qty: 1,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(typeof json._id).toBe('string');
        expect(json.client).toBe('client');
        expect(typeof json.dateEntry).toBe('string');
        expect(Array.isArray(json.products)).toBe(true);
        expect(json.products.length).toBe(1);
        expect(json.products[0].product.name).toBe('Test 0');
        expect(json.products[0].product.price).toBe(5);
      })
  ));

  it('should create order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 1',
          price: 25,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsAdmin('/orders', {
        method: 'POST',
        body: {
          client: 'client 1',
          table: '2',
          products: [
            {
              qty: 1,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(typeof json._id).toBe('string');
        expect(typeof json.dateEntry).toBe('string');
        expect(Array.isArray(json.products)).toBe(true);
        expect(json.products.length).toBe(1);
        expect(json.products[0].product.name).toBe('Test 1');
        expect(json.products[0].product.price).toBe(25);
      })
  ));
});

describe('GET /orders', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders')
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should get orders as user', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 2',
          price: 25,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => (
        Promise.all([
          fetchAsTestUser('/orders', {
            method: 'POST',
            body: {
              client: 'client 2',
              table: '2',
              products: [
                {
                  qty: 1,
                  product,
                },
              ],
            },
          }),
          fetchAsAdmin('/orders', {
            method: 'POST',
            body: {
              client: 'client 3',
              table: '2',
              products: [
                {
                  qty: 1,
                  product,
                },
              ],
            },
          }),
        ])
          .then((responses) => {
            expect(responses[0].status).toBe(201);
            expect(responses[1].status).toBe(201);
            return fetchAsTestUser('/orders');
          })
          .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
          })
      ))
      .then((orders) => {
        expect(Array.isArray(orders)).toBe(true);
        expect(orders.length > 0);
        const userIds = orders.reduce((memo, order) => (
          (memo.indexOf(order.userId) === -1)
            ? [...memo, order.userId]
            : memo
        ), []);
        expect(userIds.length >= 1).toBe(true);
      })
  ));

  it('should get orders as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 3',
          price: 25,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => (
        Promise.all([
          fetchAsTestUser('/orders', {
            method: 'POST',
            body: {
              client: 'client 4',
              table: '4',
              products: [
                {
                  qty: 2,
                  product,
                },
              ],
            },
          }),
          fetchAsAdmin('/orders', {
            method: 'POST',
            body: {
              client: 'client 5',
              table: '5',
              products: [
                {
                  qty: 3,
                  product,
                },
              ],
            },
          }),
        ])
          .then((responses) => {
            expect(responses[0].status).toBe(201);
            expect(responses[1].status).toBe(201);
            return fetchAsAdmin('/orders');
          })
          .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
          })
      ))
      .then((orders) => {
        expect(Array.isArray(orders)).toBe(true);
        expect(orders.length > 0);
        const userIds = orders.reduce((memo, order) => (
          (memo.indexOf(order.userId) === -1)
            ? [...memo, order.userId]
            : memo
        ), []);
        expect(userIds.length >= 1).toBe(true);
      })
  ));
});

describe('GET /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/653349de59b0a46266918520')
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/orders/653349de59b0a46266918520')
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should get order as user', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 4',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 6',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/orders/${json._id}`))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.products.length).toBe(1);
        expect(json.products[0].product.name).toBe('Test 4');
        expect(json.products[0].product.price).toBe(5);
      })
  ));

  it('should get order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 5',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 7',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/orders/${json._id}`))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.products.length).toBe(1);
        expect(json.products[0].product.name).toBe('Test 5');
        expect(json.products[0].product.price).toBe(5);
      })
  ));
});

describe('PUT /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/653349de59b0a46266918520', { method: 'PUT' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when not found', () => (
    fetchAsAdmin('/orders/653349de59b0a46266918520', {
      method: 'PUT',
      body: { status: 'pending' },
    })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should fail with 400 when bad props', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 6',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 7',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/orders/${json._id}`))
      .then((resp) => resp.json())
      .then((json) => fetchAsAdmin(`/orders/${json._id}`, { method: 'PUT' }))
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when bad status', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 7',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 7',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/orders/${json._id}`, {
        method: 'PUT',
        body: { status: 'oh yeah!' },
      }))
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should update order (set status to ready)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 8',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 7',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PUT',
          body: { status: 'ready' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('ready');
        expect(typeof json.dateProcessed).toBe('string');
      })
  ));

  it('should update order (set status to delivered)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 10',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 7',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PUT',
          body: { status: 'delivered' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.status).toBe('delivered'))
  ));
});

describe('DELETE /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/653349de59b0a46266918520', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when not found', () => (
    fetchAsAdmin('/orders/653349de59b0a46266918520', { method: 'DELETE' })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should delete other order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: {
          name: 'Test 11',
          price: 5,
          image: 'imagen.png',
          type: 'desayuno',
        },
      }),
      fetchAsAdmin('/users/test@test.com'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(201);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: {
          client: 'client 7',
          table: '5',
          products: [
            {
              qty: 3,
              product,
            },
          ],
        },
      }))
      .then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
      .then(
        ({ _id }) => fetchAsAdmin(`/orders/${_id}`, { method: 'DELETE' })
          .then((resp) => ({ resp, _id })),
      )
      .then(({ resp, _id }) => {
        expect(resp.status).toBe(200);
        return fetchAsAdmin(`/orders/${_id}`);
      })
      .then((resp) => expect(resp.status).toBe(404))
  ));
});
