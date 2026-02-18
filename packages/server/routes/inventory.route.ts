import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { InventoryCreateSchema, InventoryQuerySchema } from '../infrastructure/database/validators/inventory.validator';
import { inventoryController } from '../controllers/inventory.controller';

const router = express.Router();

router.get('/', [auth, validate(InventoryQuerySchema, 'query'), paginate], inventoryController.getInventory);
router.post('/', [auth, validate(InventoryCreateSchema, 'body')], inventoryController.createInventory);

export default router;
