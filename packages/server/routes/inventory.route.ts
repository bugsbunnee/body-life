import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';

import { InventoryCreateSchema, InventoryQuerySchema } from '../infrastructure/database/validators/inventory.validator';
import { inventoryController } from '../controllers/inventory.controller';
import { DEFAULT_ROLES } from '../utils/constants';

const router = express.Router();

router.get('/', [auth, protectedRoute(DEFAULT_ROLES), validate(InventoryQuerySchema, 'query'), paginate], inventoryController.getInventory);
router.post('/', [auth, protectedRoute(DEFAULT_ROLES), validate(InventoryCreateSchema, 'body')], inventoryController.createInventory);

export default router;
