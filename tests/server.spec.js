const request = require("supertest");
const { server } = require("../index.js");

describe("Operaciones CRUD de cafes", () => {
  it("Status 200", async () => {
    const response = await request(server).get("/cafes").send();
    const status = response.statusCode;
    expect(status).toBe(200);
  });

  it("Array received", async () => {
    const { body } = await request(server).get("/cafes").send();
    expect(body).toBeInstanceOf(Array);
  });

  it("Status 400 removing item with nonexistent id", async () => {
    const fakeId = 0;
    const response = await request(server).delete(`/cafes/${fakeId}`).send();
    const status = response.statusCode;
    expect(status).toBe(400);
  });

  it("Adding new item", async () => {
    const id = Math.floor(Math.random() * 999);
    const item = { id: id, nombre: "New Item" };
    const { body: products } = await request(server).post("/cafes").send(item);
    expect(products).toContainEqual(item);
  });

  it("Obtaining status 201 adding new item", async () => {
    const id = Math.floor(Math.random() * 999);
    const item = { id: id, nombre: "New Item" };
    const response = await request(server).post("/cafes").send(item);
    const status = response.statusCode;
    expect(status).toBe(201);
  });

  it("Obtaining status 400 updating item with mismatched id", async () => {
    const id = Math.floor(Math.random() * 999);
    const item = { id: id, nombre: "Name" };
    const response = await request(server).post("/cafes").send(item);
    const fakeId = Math.floor(Math.random() * 999);
    const newItem = { id: fakeId, nombre: "New Name" };
    const newResponse = await request(server).put(`/cafes/${id}`).send(newItem);
    expect(newResponse.status).toBe(400);
  });
});

afterAll(() => {
  server.close();
});
