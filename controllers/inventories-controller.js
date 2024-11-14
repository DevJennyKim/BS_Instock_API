import initKnex from 'knex';
import configuration from '../knexfile.js';
import { validateRequest } from '../utils/validateRequest.js';
const knex = initKnex(configuration);

const getInventoriesList = async (_req, res) => {
  try {
    const data = await knex('inventories')
      .join('warehouses', 'warehouses.id', 'inventories.warehouse_id')
      .select(
        'inventories.id',
        'warehouses.warehouse_name',
        'inventories.item_name',
        'inventories.description',
        'inventories.category',
        'inventories.status',
        'inventories.quantity'
      );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: `Error retrieving inventories: ${error}` });
  }
};

const addInventoryItem = async (req, res) => {
  const { result, message } = validateRequest(req.body);

  if (!result) {
    return res.status(400).json({ message: message });
  }

  try {
    const warehouseExists = await knex('warehouses')
      .where({ id: req.body.warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: 'Warehouse ID does not exist' });
    }

    const dbResult = await knex('inventories').insert(req.body);

    const newInventoryItemId = dbResult[0];

    const createdInventoryItem = await knex('inventories')
      .where({ id: newInventoryItemId })
      .first();

    res.status(201).json(createdInventoryItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to create new inventory: ${error.message}` });
  }
};

const updateInventories = async (req, res) => {
  const { result, message } = validateRequest(req.body);

  if (!result) {
    return res.status(400).json({ message: message });
  }

  try {
    const { id, ...updateData } = req.body;

    const warehouseExists = await knex('warehouses')
      .where({ id: updateData.warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: 'Warehouse ID does not exist' });
    }
    if (isNaN(updateData.quantity)) {
      return res.status(400).json({ message: 'Quantity must be a number' });
    }
    updateData.updated_at = new Date();

    const rowsUpdated = await knex('inventories')
      .where({ id: req.params.id })
      .update(updateData);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Inventory item with ID ${req.params.id} not found`,
      });
    }
    const updatedInventory = await knex('inventories')
      .where({
        id: req.params.id,
      })
      .first();
    res.json(updatedInventory);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update inventory item with ID ${req.params.id}: ${error.message}`,
    });
  }
};

export { getInventoriesList, updateInventories, addInventoryItem };
