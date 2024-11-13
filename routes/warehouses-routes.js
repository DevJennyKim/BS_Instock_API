import express from "express";
const router = express.Router();
import * as warehousesController from "../controllers/warehouses-controller.js";

router.route("/").get(warehousesController.getWarehousesList);

export default router;
