import express from 'express';
const router = express.Router();
import * as inventoriesController from '../controllers/inventories-controller.js';

router
  .route('/')
  .get(inventoriesController.getInventoriesList)
  .post(inventoriesController.addInventories);

router.route('/:id').put(inventoriesController.updateInventories);

export default router;
