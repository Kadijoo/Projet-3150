const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Proposition = require("../models/Proposition");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
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
  await Proposition.deleteMany();
  await MenuItem.deleteMany();
  await User.deleteMany();
});

describe("Contrôleur Proposition", () => {
  let utilisateur;
  let menuItem;

  beforeEach(async () => {
    utilisateur = await User.create({
      nom_restaurant: "Test User",
      email: "test@example.com",
      mot_passe: "password123",
      type_utilisateur: "client"
    });

    menuItem = await MenuItem.create({
      nom: "Burger",
      description: "Délicieux burger",
      position: 1,
      section: new mongoose.Types.ObjectId(),
      menu: new mongoose.Types.ObjectId()
    });
  });

  it("devrait créer une proposition", async () => {
    const res = await request(app)
      .post("/api/propositions")
      .send({
        nom: "Proposition test",
        description: "Ajouter du fromage",
        menuItem: menuItem._id.toString(),
        utilisateur: utilisateur._id.toString()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe("Proposition test");
    expect(res.body.utilisateur).toBe(utilisateur._id.toString());
  });

  it("devrait récupérer toutes les propositions", async () => {
    await Proposition.create({
      nom: "Proposition 1",
      menuItem: menuItem._id,
      utilisateur: utilisateur._id
    });

    const res = await request(app).get("/api/propositions");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("devrait récupérer une proposition par ID", async () => {
    const proposition = await Proposition.create({
      nom: "Proposition Unique",
      menuItem: menuItem._id,
      utilisateur: utilisateur._id
    });

    const res = await request(app).get(`/api/propositions/${proposition._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Proposition Unique");
  });

  it("devrait mettre à jour une proposition", async () => {
  const user = await User.create({
    nom: "Testeur",
    email: "testeur@example.com",
    mot_passe: "password123",
    type_utilisateur: "client"
  });

  const menu = await Menu.create({
    titre: "Menu test",
    restaurant: new mongoose.Types.ObjectId()
  });

  const menuItem = await MenuItem.create({
    nom: "Test item",
    position: 0,
    menu: menu._id,
    section: new mongoose.Types.ObjectId()
  });

  const proposition = await Proposition.create({
    nom: "À mettre à jour",
    description: "desc",
    menuItem: menuItem._id,
    utilisateur: user._id
  });

  const res = await request(app)
    .put(`/api/propositions/${proposition._id}`)
    .send({
      nom: "Mise à jour",
      description: "desc",
      statut: "acceptée",
      menuItem: menuItem._id.toString(),
      utilisateur: user._id.toString()
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.statut).toBe("acceptée");
});


  it("devrait supprimer une proposition", async () => {
    const proposition = await Proposition.create({
      nom: "À Supprimer",
      menuItem: menuItem._id,
      utilisateur: utilisateur._id
    });

    const res = await request(app).delete(`/api/propositions/${proposition._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Proposition supprimée avec succès");
  });
});
