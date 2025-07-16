const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Notification = require("../models/Notification");
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
  await Notification.deleteMany();
  await User.deleteMany();
});

describe("Contrôleur Notification", () => {
  it("devrait créer une notification", async () => {
    const user = await User.create({
      nom_restaurant: "Test Notif",
      email: "notif@example.com",
      mot_passe: "password",
      type_utilisateur: "client"
    });

    const res = await request(app)
      .post("/api/notifications")
      .send({
        message: "Nouvelle commande reçue",
        utilisateur: user._id
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Nouvelle commande reçue");
    expect(res.body.utilisateur).toBe(user._id.toString());
  });

  it("devrait récupérer toutes les notifications", async () => {
    const user = await User.create({
      nom_restaurant: "Notif User",
      email: "notif2@example.com",
      mot_passe: "password",
      type_utilisateur: "client"
    });

    await Notification.create({
      message: "Test 1",
      utilisateur: user._id
    });

    await Notification.create({
      message: "Test 2",
      utilisateur: user._id
    });

    const res = await request(app).get("/api/notifications");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("devrait mettre à jour une notification", async () => {
  const user = await User.create({
    nom_restaurant: "Notif Modif",
    email: "notif3@example.com",
    mot_passe: "password",
    type_utilisateur: "client"
  });

  const notification = await Notification.create({
    message: "À lire",
    utilisateur: user._id
  });
  console.log("Notification ID:", notification._id);

  const res = await request(app)
    .put(`/api/notifications/${notification._id.toString()}`)
    .send({ lu: true });

  console.log("Response body:", res.body); 

  expect(res.statusCode).toBe(200);
  expect(res.body.lu).toBe(true);
});


  it("devrait supprimer une notification", async () => {
    const user = await User.create({
      nom_restaurant: "Notif Delete",
      email: "notif4@example.com",
      mot_passe: "password",
      type_utilisateur: "client"
    });

    const notification = await Notification.create({
      message: "À supprimer",
      utilisateur: user._id
    });

    const res = await request(app).delete(`/api/notifications/${notification._id}`);
    expect(res.statusCode).toBe(204);
  });
});
