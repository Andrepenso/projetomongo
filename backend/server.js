const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("🟢 Conectado ao MongoDB Atlas"));
db.on("error", (err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Importando as rotas
const itemRoutes = require("./routes/items");
app.use("/items", itemRoutes);  // ✅ Certifique-se de que "/items" está correto

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
