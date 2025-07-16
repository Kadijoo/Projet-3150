// ✅ tests/menuItem.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

const Menu = require("../models/Menu");
const Section = require("../models/Section");
const MenuItem = require("../models/MenuItem");

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
  await MenuItem.deleteMany();
  await Menu.deleteMany();
  await Section.deleteMany();
});

describe("Contrôleur MenuItem", () => {
  let menu, section;

  beforeEach(async () => {
    menu = await Menu.create({
      titre: "Menu de test",
      restaurant: new mongoose.Types.ObjectId()
    });

    section = await Section.create({
      nom: "Entrées",
      menu: menu._id
    });
  });

  it("devrait créer un MenuItem", async () => {
    const res = await request(app)
      .post(`/api/menus/${menu._id}/items`)
      .send({
        nom: "Salade verte",
        description: "Une salade simple",
        position: 1,
        statut: "actif",
        section: section._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Salade verte");
    expect(res.body.menu).toBe(menu._id.toString());
    expect(res.body.section).toBe(section._id.toString());
  });

  it("devrait récupérer les MenuItems d’un menu", async () => {
    await MenuItem.create({
      nom: "Soupe",
      position: 0,
      section: section._id,
      menu: menu._id
    });

    const res = await request(app).get(`/api/menus/${menu._id}/items`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("devrait mettre à jour un MenuItem", async () => {
    const item = await MenuItem.create({
      nom: "Brochette",
      position: 2,
      section: section._id,
      menu: menu._id
    });

    const res = await request(app)
      .put(`/api/menus/${menu._id}/items/${item._id}`)
      .send({ description: "Grillée" });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Grillée");
  });

  it("devrait supprimer un MenuItem", async () => {
    const item = await MenuItem.create({
      nom: "Jus naturel",
      position: 3,
      section: section._id,
      menu: menu._id
    });

    const res = await request(app).delete(`/api/menus/${menu._id}/items/${item._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item supprimé avec succès.");
  });
});
