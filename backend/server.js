require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // Permitir JSON no body das requisições
app.use(express.urlencoded({ extended: true })); // Permitir dados via form
app.use(cors()); // Permitir requisições do frontend

// Conectar ao MongoDB Atlas
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado ao MongoDB Atlas!"))
  .catch(err => {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  });

// Criar Schema e Modelo do MongoDB
const ItemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
}, { timestamps: true }); // Adiciona data de criação e atualização automaticamente

const Item = mongoose.model("Item", ItemSchema);

// Rota para buscar todos os itens
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Erro ao buscar itens:", error.message);
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// Rota para adicionar um novo item
app.post("/items", async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
      return res.status(400).json({ error: "Nome e descrição são obrigatórios!" });
    }

    const novoItem = new Item({ nome, descricao });
    const itemSalvo = await novoItem.save();

    res.status(201).json(itemSalvo);
  } catch (error) {
    console.error("❌ Erro ao adicionar item:", error.message);
    res.status(500).json({ error: "Erro ao adicionar item" });
  }
});

// Rota para editar um item existente
app.put("/items/:id", async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID inválido!" });
    }

    if (!nome || !descricao) {
      return res.status(400).json({ error: "Nome e descrição são obrigatórios!" });
    }

    const itemAtualizado = await Item.findByIdAndUpdate(id, { nome, descricao }, { new: true });

    if (!itemAtualizado) {
      return res.status(404).json({ error: "Item não encontrado!" });
    }

    res.status(200).json(itemAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar item:", error.message);
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
});

// Rota para excluir um item
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.status(200).json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o item' });
  }
});





// Iniciar o servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
