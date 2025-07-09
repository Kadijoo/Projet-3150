const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Contrôleur Menu", () => {
  let restaurant;

  beforeEach(async () => {
    await Menu.deleteMany();
    await Restaurant.deleteMany();

    restaurant = await Restaurant.create({
      nom: "Test Restaurant",
      adresse: "123 rue test",
      ville: "Montréal"
    });
  });

  it("devrait créer un menu", async () => {
    const res = await request(app)
      .post("/api/menus")
      .send({
        titre: "Menu Déjeuner",
        status: "actif",
        description: "Menu du matin",
        restaurant: restaurant._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.titre).toBe("Menu Déjeuner");
    expect(res.body.restaurant).toBe(String(restaurant._id));
  });

  it("devrait récupérer tous les menus", async () => {
    await Menu.create({
      status: "actif",
      titre: "Menu Test",
      restaurant: restaurant._id
    });

    const res = await request(app).get("/api/menus");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("devrait récupérer un menu par ID", async () => {
    const menu = await Menu.create({
      status: "actif",
      titre: "Menu Spécial",
      restaurant: restaurant._id
    });

    const res = await request(app).get(`/api/menus/${menu._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.titre).toBe("Menu Spécial");
  });

  it("devrait mettre à jour un menu", async () => {
    const menu = await Menu.create({
      status: "actif",
      titre: "Ancien Menu",
      restaurant: restaurant._id
    });

    const res = await request(app)
      .put(`/api/menus/${menu._id}`)
      .send({ titre: "Nouveau Menu" });

    expect(res.statusCode).toBe(200);
    expect(res.body.titre).toBe("Nouveau Menu");
  });

  it("devrait supprimer un menu", async () => {
    const menu = await Menu.create({
      status: "actif",
      titre: "Menu à supprimer",
      restaurant: restaurant._id
    });

    const res = await request(app).delete(`/api/menus/${menu._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });
});
