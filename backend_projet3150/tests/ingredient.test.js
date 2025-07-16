// tests/ingredient.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Ingredient = require("../models/Ingredient");
const Categorie = require("../models/Categorie");

let mongoServer;
let categorieId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Créer une catégorie pour les tests
  const categorie = await Categorie.create({ nom: "Légume" });
  categorieId = categorie._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Ingredient.deleteMany();
});

describe("Contrôleur Ingredient", () => {
  it("devrait créer un ingrédient", async () => {
    const res = await request(app)
      .post("/api/ingredients")
      .send({
        nom: "Tomate",
        categorie: categorieId,
        description: "Un légume rouge"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Tomate");
  });

  it("devrait récupérer tous les ingrédients", async () => {
    await Ingredient.create({
      nom: "Oignon",
      categorie: categorieId,
      description: "Un légume piquant"
    });

    const res = await request(app).get("/api/ingredients");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("devrait mettre à jour un ingrédient", async () => {
    const ingr = await Ingredient.create({
      nom: "Poivron",
      categorie: categorieId,
      description: "Vert ou rouge"
    });

    const res = await request(app)
  .put(`/api/ingredients/${ingr._id}`)
  .send({
    nom: "Poivron",
    categorie: categorieId,
    description: "Vert, rouge ou jaune"
  });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Vert, rouge ou jaune");
  });

  it("devrait supprimer un ingrédient", async () => {
    const ingr = await Ingredient.create({
      nom: "Ail",
      categorie: categorieId,
      description: "Très fort"
    });

    const res = await request(app).delete(`/api/ingredients/${ingr._id}`);
    expect(res.statusCode).toBe(204);

    const check = await Ingredient.findById(ingr._id);
    expect(check).toBeNull();
  });
});
