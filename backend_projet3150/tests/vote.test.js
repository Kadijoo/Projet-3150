// tests/vote.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

const Vote = require("../models/Vote");
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
  await Vote.deleteMany();
  await User.deleteMany();
  await Menu.deleteMany();
});

describe("Contrôleur Vote", () => {
  it("devrait créer un vote", async () => {
    const user = await User.create({
      nom: "Testeur",
      email: "testeur@example.com",
      mot_passe: "test1234",
      type_utilisateur: "client"
    });

    const menu = await Menu.create({
      titre: "Menu Test",
      restaurant: new mongoose.Types.ObjectId()
    });

    const res = await request(app)
      .post("/api/votes")
      .send({
        type: "UP",
        cible: menu._id.toString(),
        cibleModel: "Menu",
        auteur: user._id.toString()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe("UP");
    expect(res.body.cible).toBe(menu._id.toString());
    expect(res.body.auteur).toBe(user._id.toString());
  });

  it("devrait refuser un vote en double", async () => {
    const user = await User.create({
      nom: "Testeur2",
      email: "test2@example.com",
      mot_passe: "pass1234",
      type_utilisateur: "client"
    });

    const menu = await Menu.create({
      titre: "Menu Double",
      restaurant: new mongoose.Types.ObjectId()
    });

    await Vote.create({
      type: "UP",
      cible: menu._id,
      cibleModel: "Menu",
      auteur: user._id
    });

    const res = await request(app)
      .post("/api/votes")
      .send({
        type: "DOWN",
        cible: menu._id.toString(),
        cibleModel: "Menu",
        auteur: user._id.toString()
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/déjà voté/);
  });

  it("devrait récupérer tous les votes", async () => {
    const user = await User.create({
      nom: "Voteur",
      email: "vote@example.com",
      mot_passe: "motdepasse",
      type_utilisateur: "client"
    });

    const menu = await Menu.create({
      titre: "Menu pour votes",
      restaurant: new mongoose.Types.ObjectId()
    });

    await Vote.create({
      type: "UP",
      cible: menu._id,
      cibleModel: "Menu",
      auteur: user._id
    });

    const res = await request(app).get("/api/votes");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("devrait supprimer un vote", async () => {
    const user = await User.create({
      nom: "SuppVote",
      email: "supp@example.com",
      mot_passe: "motdepasse",
      type_utilisateur: "client"
    });

    const menu = await Menu.create({
      titre: "Menu suppression",
      restaurant: new mongoose.Types.ObjectId()
    });

    const vote = await Vote.create({
      type: "UP",
      cible: menu._id,
      cibleModel: "Menu",
      auteur: user._id
    });

    const res = await request(app).delete(`/api/votes/${vote._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Vote supprimé avec succès");
  });
});
