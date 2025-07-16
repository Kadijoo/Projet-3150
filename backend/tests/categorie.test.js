const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Categorie = require("../models/Categorie");

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
  await Categorie.deleteMany();
});

describe("Contrôleur Categorie", () => {
  it("devrait créer une catégorie", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send({
        nom: "Légumes",
        description: "Ingrédients végétaux"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Légumes");
    expect(res.body.description).toBe("Ingrédients végétaux");
  });

  it("devrait récupérer toutes les catégories", async () => {
    await Categorie.create({ nom: "Viandes", description: "Produits carnés" });

    const res = await request(app).get("/api/categories");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].nom).toBe("Viandes");
  });

  it("devrait mettre à jour une catégorie", async () => {
    const cat = await Categorie.create({ nom: "Fruits", description: "Sucrés" });

    const res = await request(app)
      .put(`/api/categories/${cat._id}`)
      .send({ nom: "Fruits frais", description: "Fruits à consommer crus" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Fruits frais");
    expect(res.body.description).toBe("Fruits à consommer crus");
  });

  it("devrait supprimer une catégorie", async () => {
    const cat = await Categorie.create({ nom: "Épices", description: "Saveurs fortes" });

    const res = await request(app).delete(`/api/categories/${cat._id}`);

    expect(res.statusCode).toBe(204);

    const check = await Categorie.findById(cat._id);
    expect(check).toBeNull();
  });
});
