// ✅ tests/plat.controller.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Plat = require("../models/Plat");
const Menu = require("../models/Menu");
const Categorie = require("../models/Categorie");
const Ingredient = require("../models/Ingredient");

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

describe("Contrôleur Plat", () => {
  let menu, categorie, ingredient;

  beforeEach(async () => {
    await Plat.deleteMany();
    await Menu.deleteMany();
    await Categorie.deleteMany();
    await Ingredient.deleteMany();

    menu = await Menu.create({
      titre: "Menu test",
      restaurant: new mongoose.Types.ObjectId()
    });

    categorie = await Categorie.create({
      nom: "Viandes",
      description: "Catégorie de viandes"
    });

    ingredient = await Ingredient.create({
      nom: "Sel",
      description: "Sel marin",
      categorie: categorie._id
    });
  });

  it("devrait créer un plat avec tous les champs", async () => {
    const response = await request(app)
      .post(`/api/menus/${menu._id}/plats`)
      .send({
        nom: "Ndolé",
        prix: 10,
        tags: ["africain", "légumes"],
        categorie: categorie._id,
        ingredients: [ingredient._id], // ← Note le tableau ici
        menu: menu._id
      });

    console.log("Création plat:", response.body); // pour debug temporaire

    expect(response.statusCode).toBe(201);
    expect(response.body.nom).toBe("Ndolé");
    expect(response.body.prix).toBe(10);
    expect(response.body.tags).toContain("africain");
    expect(response.body.categorie).toBe(String(categorie._id));
    expect(response.body.ingredients).toContain(String(ingredient._id));
    expect(response.body.menu).toBe(String(menu._id));
  });

  it("devrait récupérer tous les plats", async () => {
    await Plat.create({
      nom: "Achu",
      prix: 12,
      tags: ["traditionnel"],
      menu: menu._id,
      ingredients: [ingredient._id],
      categorie: categorie._id
    });
    const res = await request(app).get("/api/plats");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("devrait récupérer un plat par ID", async () => {
    const plat = await Plat.create({
      nom: "Ekwang",
      prix: 14,
      tags: ["local"],
      menu: menu._id,
      ingredients: [ingredient._id],
      categorie: categorie._id
    });
    const res = await request(app).get(`/api/plats/${plat._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Ekwang");
  });

  it("devrait mettre à jour un plat existant", async () => {
    const plat = await Plat.create({
      nom: "Okok",
      prix: 11,
      menu: menu._id,
      ingredients: [ingredient._id],
      categorie: categorie._id
    });
    const res = await request(app)
      .put(`/api/plats/${plat._id}`)
      .send({ prix: 13 });

    expect(res.statusCode).toBe(200);
    expect(res.body.prix).toBe(13);
  });



  it("devrait supprimer un plat", async () => {
    const plat = await Plat.create({
      nom: "Koki",
      prix: 9,
      menu: menu._id,
      ingredients: [ingredient._id],
      categorie: categorie._id
    });
    const res = await request(app).delete(`/api/plats/${plat._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Plat supprimé");
  });
});

