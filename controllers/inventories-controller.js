import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getInventoriesList = async (_req, res) => {
  try {
    const data = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: `Error retrieving inventories: ${error}` });
  }
};

export { getInventoriesList };
