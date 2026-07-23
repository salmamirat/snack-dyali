const express = require("express");

const router = express.Router();

const platController = require("../controllers/plat.controller");


router.get("/", platController.getPlats);

router.get("/:id", platController.getPlatById);

router.post("/", platController.createPlat);

router.put("/:id", platController.updatePlat);

router.delete("/:id", platController.deletePlat);


module.exports = router;