const express = require("express");
const router = express.Router();
const { getPublicStats, getPublicMapData } = require("../controllers/public.controller");

router.get("/stats", getPublicStats);
router.get("/map-data", getPublicMapData);

module.exports = router;
