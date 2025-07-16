const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const User = require("../models/User");

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
  await User.deleteMany();
});

describe("Contrôleur User", () => {
  it("devrait inscrire un client", async () => {
  const res = await request(app)
    .post("/api/users/register/client")
    .send({
      nom: "Client lambda",
      email: "client@example.com",
      mot_passe: "client123", // important : même nom que dans le modèle
      type_utilisateur: "client"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe("Utilisateur enregistré.");
});
  

  it("devrait inscrire un restaurateur", async () => {
  const res = await request(app)
    .post("/api/users/register/restaurateur")
    .send({
      nom_restaurant: "RestoTest",
      email: "resto@example.com",
      mot_passe: "restopass",
      type_utilisateur: "restaurateur",
      telephone: "123456789",
      adresse: "123 Rue Test",
      type_cuisine: "africaine",
      description: "Un bon resto"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe("Restaurateur enregistré.");
});


  it("devrait connecter un utilisateur avec les bons identifiants", async () => {
    await User.create({
      nom: "Client Login",
      email: "login@example.com",
      mot_passe: "testpass",
      type_utilisateur: "client"
    });

    const res = await request(app).post("/api/users/login").send({
      email: "login@example.com",
      mot_de_passe: "testpass",
      type_utilisateur: "client"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Connexion réussie");
    expect(res.body.utilisateur.nom).toBe("Client Login");
  });

  it("devrait refuser une connexion avec un mauvais mot de passe", async () => {
    await User.create({
      nom: "Bad Login",
      email: "bad@example.com",
      mot_passe: "correctpass",
      type_utilisateur: "client"
    });

    const res = await request(app).post("/api/users/login").send({
      email: "bad@example.com",
      mot_de_passe: "wrongpass",
      type_utilisateur: "client"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Mot de passe incorrect");
  });

  it("devrait refuser une connexion avec un email inconnu", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "notfound@example.com",
      mot_de_passe: "somepass",
      type_utilisateur: "client"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Utilisateur non trouvé");
  });
});
