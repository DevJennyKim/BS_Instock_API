import initKnex from "knex";
import configuration from "../knexfile.js";
import isEmail from "isemail";
import { phone } from "phone";
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

const addWarehouse = async (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    if (!value) {
      return res.status(400).json({
        message: "Please provide all required form fields in the request",
      });
    }
  }
  if (!isEmail.validate(req.body.contact_email, { tld: true })) {
    return res.status(400).json({
      message: "Please provide a valid email address in the request",
    });
  }
  if (!phone(req.body.phone).isValid) {
    return res.status(400).json({
      message: "Please provide a valid phone number in the request",
    });
  }

  try {
    const result = await knex("warehouses").insert(req.body);

    const newWarehouseId = result[0];
    const createdWarehouse = await knex("warehouses").where({
      id: newWarehouseId,
    });

    res.status(201).json(createdWarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${error}`,
    });
  }
};

export { getWarehousesList, getWarehouseById, addWarehouse };
