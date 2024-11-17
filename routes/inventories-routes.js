import express from "express";
const router = express.Router();
import * as inventoriesController from "../controllers/inventories-controller.js";

router
  .route("/")
  .get(inventoriesController.getInventoriesList)
  .post(inventoriesController.addInventoryItem);

router
  .route("/:id")
  .put(inventoriesController.updateInventoryItem)
  .delete(inventoriesController.deleteInventoryItem)
  .get(inventoriesController.getInventoryItemById);

export default router;
