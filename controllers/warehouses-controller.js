import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getWarehousesList = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: `Error retrieving warehouses: ${error}` });
  }
};

export { getWarehousesList };
