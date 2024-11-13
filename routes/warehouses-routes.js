import express from 'express';
const router = express.Router();
import * as warehousesController from '../controllers/warehouses-controller.js';

router.route('/').get(warehousesController.getWarehousesList);

router.route('/:id').post(warehousesController.updateWarehouse);

export default router;
