import express from 'express';
const router = express.Router();
import * as inventoriesController from '../controllers/inventories-controller.js';

router.route('/').get(inventoriesController.getInventoriesList);

router.route('/:id')
    .put(inventoriesController.updateInventories)
    .delete(inventoriesController.deleteInventory);

export default router;
