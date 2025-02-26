const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Criar um item
router.post("/", async (req, res) => {
  try {
    const novoItem = new Item(req.body);
    await novoItem.save();
    res.status(201).json(novoItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// Buscar todos os itens
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// Editar um item
router.put("/:id", async (req, res) => {
  try {
    const itemAtualizado = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(itemAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
});

// Excluir um item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir item" });
  }
});

module.exports = router;
