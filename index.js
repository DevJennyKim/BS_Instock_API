import 'dotenv/config';
import express from 'express';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT || 5050;

import inventoriesRoutes from './routes/inventories-routes.js';
import warehousesRoutes from './routes/warehouses-routes.js';

app.use(express.json());
app.use(cors());

app.use('/api/warehouses', warehousesRoutes);
app.use('/api/inventories', inventoriesRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
