import express from "express";
const router = express.Router();
import * as warehousesController from "../controllers/warehouses-controller.js";

router
  .route("/")
  .get(warehousesController.getWarehousesList)
  .post(warehousesController.addWarehouse);

router
  .route("/:id")
  .get(warehousesController.getWarehouseById)
  .put(warehousesController.updateWarehouse)
  .delete(warehousesController.deleteWarehouse);

router
  .route("/:id/inventories")
  .get(warehousesController.getInventoriesByWarehouseId);
export default router;
