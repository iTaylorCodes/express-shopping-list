process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
const items = require("../fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(function () {
  items.push(popsicle);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [popsicle] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: popsicle });
  });

  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ name: "Cheerios", price: 3.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "Cheerios", price: 3.99 } });
  });

  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items/:name", () => {
  test("Updates an item's name", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({ name: "Icee", price: 17.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Icee", price: 17.99 } });
  });

  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/Pringles`).send({ name: "Chips" });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deletes an item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });

  test("Responds with 404 for deleting invalid item", async () => {
    const resp = await request(app).delete(`/items/ham`);
    expect(resp.statusCode).toBe(404);
  });
});
