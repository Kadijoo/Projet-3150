const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app"); // Ton app Express
const Avis = require("../models/Avis");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

describe("Modèle Avis", () => {
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

  afterEach(async () => {
    await Avis.deleteMany();
  });

  it("devrait enregistrer un avis valide", async () => {
    const avis = new Avis({
      contenu: "Très bon plat",
      note: 4,
      auteur: new mongoose.Types.ObjectId(),
      cible: new mongoose.Types.ObjectId(),
      cibleModel: "Plat"
    });

    const saved = await avis.save();
    expect(saved._id).toBeDefined();
    expect(saved.note).toBe(4);
  });

  it("ne devrait pas enregistrer un avis sans contenu", async () => {
    const avis = new Avis({
      note: 3,
      auteur: new mongoose.Types.ObjectId(),
      cible: new mongoose.Types.ObjectId(),
      cibleModel: "Menu"
    });

    await expect(avis.save()).rejects.toThrow();
  });

  it("ne devrait pas accepter une note supérieure à 5", async () => {
    const avis = new Avis({
      contenu: "Trop bon",
      note: 6,
      auteur: new mongoose.Types.ObjectId(),
      cible: new mongoose.Types.ObjectId(),
      cibleModel: "Menu"
    });

    await expect(avis.save()).rejects.toThrow();
  });

  it("ne devrait pas accepter une cibleModel invalide", async () => {
    const avis = new Avis({
      contenu: "Hmm...",
      note: 4,
      auteur: new mongoose.Types.ObjectId(),
      cible: new mongoose.Types.ObjectId(),
      cibleModel: "Produit" // <-- non autorisé
    });

    await expect(avis.save()).rejects.toThrow();
  });

  it("ne devrait pas accepter un contenu trop court", async () => {
    const avis = new Avis({
      contenu: "OK",
      note: 3,
      auteur: new mongoose.Types.ObjectId(),
      cible: new mongoose.Types.ObjectId(),
      cibleModel: "Menu"
    });

    await expect(avis.save()).rejects.toThrow();
  });
});
