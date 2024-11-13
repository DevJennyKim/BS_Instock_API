import express from 'express';
const router = express.Router();
import * as warehousesController from '../controllers/warehouses-controller.js';

router.route('/').get(warehousesController.getWarehousesList);

router.route('/:id').put(warehousesController.updateWarehouse);

export default router;
