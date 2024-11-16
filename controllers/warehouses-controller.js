import initKnex from "knex";
import configuration from "../knexfile.js";
import { sortList } from "../utils/sortList.js";
import { validateRequest } from "../utils/validateRequest.js";

const knex = initKnex(configuration);

const getWarehousesList = async (req, res) => {
  const searchTerm = req.query.s || "";
  const { sort_by, order_by } = req.query;

  try {
    const data = await knex("warehouses")
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_position",
        "contact_name",
        "contact_phone",
        "contact_email"
      )
      .where("warehouse_name", "like", `%${searchTerm}%`)
      .orWhere("address", "like", `%${searchTerm}%`)
      .orWhere("contact_name", "like", `%${searchTerm}%`)
      .orWhere("contact_phone", "like", `%${searchTerm}%`)
      .orWhere("contact_email", "like", `%${searchTerm}%`);

    if (sort_by && order_by) {
      return res.status(200).json(sortList(data, sort_by, order_by));
    }

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
  const { result, message } = validateRequest(req.body);

  if (!result) {
    return res.status(400).json({ message: message });
  }

  try {
    const { id, ...updateData } = req.body;

    updateData.updated_at = new Date();

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
  const { result, message } = validateRequest(req.body);

  if (!result) {
    return res.status(400).json({ message: message });
  }

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

const getInventoryByWarehouseId = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();

    if (!warehouse) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${warehouseId} not found` });
    }
    const inventories = await knex("inventories")
      .select("id", "item_name", "category", "status", "quantity")
      .where({ warehouse_id: warehouseId });

    res.status(200).json(inventories);
  } catch (error) {
    console.log("Error fetching inventories:", error);
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
};

const deleteWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
  try {
    const rowsDeleted = await knex("warehouses")
      .where({ id: warehouseId })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${warehouseId} not found` });
    }

    await knex("inventories").where({ warehouse_id: warehouseId }).del();
    await knex("warehouses").where({ id: warehouseId }).del();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
};

export {
  getWarehousesList,
  getWarehouseById,
  updateWarehouse,
  addWarehouse,
  getInventoryByWarehouseId,
  deleteWarehouse,
};
