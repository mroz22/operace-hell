"use strict";

const request = require('supertest');

const app = require('../../app');
const User = require('../../db/models').User;

let baseUrl = '/api/rest/users';

beforeEach(async () => {
  try {
    await User.destroy({ where: {}});
  } catch(err) {
    console.log(err);
  }
});

describe(`POST: ${baseUrl}/:id`, () => {
  test('It should save a new user and return it', async () => {
    const response = await request(app)
    .post(baseUrl)
    .send({name: 'bob', email: 'email@email.com'});
    expect(response.statusCode).toBe(200);
  });
});

describe(`GET: ${baseUrl}/:id`, ()=> {
  test('It should get user by id', async () => {
    let user = await User.create({name: 'funny user', email: 'funny email'});
    const response = await request(app)
    .get(`${baseUrl}/${user.id}`);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', user.id);
  });
});

describe(`GET: ${baseUrl}`, ()=> {
  test('It should get nothing from empty table', async () => {
    const response = await request(app)
    .get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0)
  });

  test('It should get an array of users', async () => {
    await User.create({name: 'funny user', email: 'funny email'});
    const response = await request(app)
    .get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1)
  });
});

describe(`PUT: ${baseUrl}/:id`, () => {
  test('It should update user and return it', async () => {
    let user = await User.create({name: 'funny user', email: 'funny email'});
    user = user.toJSON();
    const response = await request(app)
    .put(`${baseUrl}/${user.id}`)
    .send({name: 'bob', email: 'email@email.com'});
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('bob');
  });
});

describe(`DELETE: ${baseUrl}/:id`, () => {
  test('It should delete single user and return 1', async () => {
    let user = await User.create({name: 'funny user', email: 'funny email'});
    const response = await request(app)
    .delete(`${baseUrl}/${user.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.numberDeleted).toBe(1);
  })
});