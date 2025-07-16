const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

let mongoServer;
let restaurateur;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Restaurant.deleteMany();
  await User.deleteMany();

  restaurateur = await User.create({
    nom: "Jean",
    prenom: "Dupont",
    email: "jean@example.com",
    mot_passe: "password123",
    nom_restaurant: "Chez Jean",
    type_utilisateur: "restaurateur"
  });
});

describe("Contrôleur Restaurant", () => {
  it("devrait créer un restaurant", async () => {
    const res = await request(app)
      .post("/api/restaurants")
      .send({
        nom: "La Marmite",
        adresse: "123 Rue Principale",
        ville: "Montréal",
        note: 4.5,
        proprietaire: restaurateur._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("La Marmite");
  });

  it("devrait refuser un utilisateur non-restaurateur", async () => {
    const client = await User.create({
      nom: "Marie",
      prenom: "Claire",
      email: "marie@example.com",
      mot_passe: "pass456",
      nom_restaurant: "Aucun",
      type_utilisateur: "client"
    });

    const res = await request(app)
      .post("/api/restaurants")
      .send({
        nom: "Fake resto",
        adresse: "Rue inconnue",
        ville: "Québec",
        proprietaire: client._id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Seuls les restaurateurs/);
  });

  it("devrait récupérer tous les restaurants", async () => {
    await Restaurant.create({
      nom: "Bon Appétit",
      adresse: "456 Rue de la Paix",
      ville: "Laval",
      proprietaire: restaurateur._id
    });

    const res = await request(app).get("/api/restaurants");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("devrait récupérer un restaurant par ID", async () => {
    const resto = await Restaurant.create({
      nom: "L'Escale",
      adresse: "789 Rue du Port",
      ville: "Longueuil",
      proprietaire: restaurateur._id
    });

    const res = await request(app).get(`/api/restaurants/${resto._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("L'Escale");
  });

  it("devrait mettre à jour un restaurant", async () => {
  const resto = await Restaurant.create({
    nom: "Initial",
    adresse: "Adresse",
    ville: "Ville",
    proprietaire: restaurateur._id
  });

  const res = await request(app)
    .put(`/api/restaurants/${resto._id}`)
    .send({
      nom: "Mis à jour",
      adresse: "Adresse",
      ville: "Ville",
      proprietaire: restaurateur._id
    }); //

  expect(res.statusCode).toBe(200);
  expect(res.body.nom).toBe("Mis à jour");
});

  it("devrait supprimer un restaurant", async () => {
    const resto = await Restaurant.create({
      nom: "À Supprimer",
      adresse: "Rue X",
      ville: "Ville Y",
      proprietaire: restaurateur._id
    });

    const res = await request(app).delete(`/api/restaurants/${resto._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Restaurant supprimé");
  });
});
