import initKnex from "knex";
import configuration from "../knexfile.js";
import { validateRequest } from "../utils/validateRequest.js";

const knex = initKnex(configuration);

const getWarehousesList = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: `Error retrieving warehouses: ${error}` });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .first();
    if (!warehouse) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Unable to retrieve warehouse data: ${error.message}` });
  }
};

const updateWarehouse = async (req, res) => {
  validateRequest(req.body);
  try {
    const { id, ...updateData } = req.body;

    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.id })
      .update(updateData);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }
    const updatedWarehouse = await knex("warehouses").where({
      id: req.params.id,
    });
    res.json(updatedWarehouse[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update warehouse with ID ${req.params.id}: ${error}`,
    });
  }
};

const addWarehouse = async (req, res) => {
  validateRequest(req.body);
  try {
    const result = await knex("warehouses").insert(req.body);

    const newWarehouseId = result[0];
    const createdWarehouse = await knex("warehouses").where({
      id: newWarehouseId,
    });

    res.status(201).json(createdWarehouse[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${error}`,
    });
  }
};

export { getWarehousesList, getWarehouseById, updateWarehouse, addWarehouse };
