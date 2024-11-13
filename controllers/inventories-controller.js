import initKnex from 'knex';
import configuration from '../knexfile.js';
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

const updateInventories = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const { warehouse_id, item_name, description, category, status, quantity } =
      updateData;
    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      quantity === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const warehouseExists = await knex('warehouses')
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: 'Warehouse ID does not exist' });
    }
    if (isNaN(quantity)) {
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
    const updatedInventory = await knex('inventories').where({
      id: req.params.id,
    });
    res.json(updatedInventory[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update inventory item with ID ${req.params.id}: ${error.message}`,
    });
  }
};

export { getInventoriesList, updateInventories };
