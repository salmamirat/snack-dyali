const { Plat } = require("../models");

const getPlats = async (req, res) => {
  try {
    const plats = await Plat.findAll();
    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findByPk(req.params.id);

    if (!plat) {
      return res.status(404).json({
        message: "Plat introuvable",
      });
    }

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createPlat = async (req, res) => {
  try {
    const { nom, prix, categorie, disponible } = req.body;

    if (
      !nom?.trim() ||
      prix === undefined ||
      Number(prix) < 0 ||
      !categorie?.trim()
    ) {
      return res.status(400).json({
        message: "Données invalides",
      });
    }

    const plat = await Plat.create({
      nom,
      prix,
      categorie,
      disponible,
    });

    res.status(201).json(plat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePlat = async (req, res) => {
  try {
    const plat = await Plat.findByPk(req.params.id);

    if (!plat) {
      return res.status(404).json({
        message: "Plat introuvable",
      });
    }

    const { nom, prix, categorie, disponible } = req.body;

    if (nom !== undefined && !nom.trim()) {
      return res.status(400).json({
        message: "Nom invalide",
      });
    }

    if (prix !== undefined && Number(prix) < 0) {
      return res.status(400).json({
        message: "Prix invalide",
      });
    }

    if (categorie !== undefined && !categorie.trim()) {
      return res.status(400).json({
        message: "Catégorie invalide",
      });
    }

    await plat.update({
      nom: nom ?? plat.nom,
      prix: prix ?? plat.prix,
      categorie: categorie ?? plat.categorie,
      disponible:
        disponible !== undefined ? disponible : plat.disponible,
    });

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePlat = async (req, res) => {
  try {
    const plat = await Plat.findByPk(req.params.id);

    if (!plat) {
      return res.status(404).json({
        message: "Plat introuvable",
      });
    }

    await plat.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPlats,
  getPlatById,
  createPlat,
  updatePlat,
  deletePlat,
};