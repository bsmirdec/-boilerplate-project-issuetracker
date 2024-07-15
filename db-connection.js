const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const db = mongoose.connection;

// Vérification de la connexion à la base de données
db.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Gestion des erreurs de connexion
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Exporter la connexion à la base de données
module.exports = db;

// Fonction pour vider une collection spécifique
// async function clearCollection(collectionName) {
//   try {
//     await mongoose.connection.collection(collectionName).deleteMany({});
//     console.log(`Collection ${collectionName} cleared`);
//   } catch (error) {
//     console.error(`Failed to clear collection ${collectionName}:`, error);
//   }
// }
