// ✅ tests/section.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

const Section = require("../models/Section");
const Menu = require("../models/Menu");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Section.deleteMany();
  await Menu.deleteMany();
});

describe("Contrôleur Section", () => {
  let menu;

  beforeEach(async () => {
    menu = await Menu.create({
      titre: "Menu principal",
      restaurant: new mongoose.Types.ObjectId()
    });
  });

  it("devrait créer une section", async () => {
    const res = await request(app)
      .post("/api/sections")
      .send({
        nom: "Entrées",
        menu: menu._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Entrées");
    expect(res.body.menu).toBe(menu._id.toString());
  });

  it("devrait récupérer toutes les sections", async () => {
    await Section.create({ nom: "Desserts", menu: menu._id });

    const res = await request(app).get("/api/sections");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("devrait récupérer une section par ID", async () => {
    const section = await Section.create({ nom: "Boissons", menu: menu._id });

    const res = await request(app).get(`/api/sections/${section._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Boissons");
  });

  it("devrait mettre à jour une section", async () => {
    const section = await Section.create({ nom: "Spécialités", menu: menu._id });

    const res = await request(app)
      .put(`/api/sections/${section._id}`)
      .send({ nom: "Spécialités revisitées", menu: menu._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Spécialités revisitées");
  });

  it("devrait supprimer une section", async () => {
    const section = await Section.create({ nom: "À partager", menu: menu._id });

    const res = await request(app).delete(`/api/sections/${section._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Section supprimée avec succès");
  });
});
