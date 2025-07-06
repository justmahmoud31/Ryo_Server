import express, { NextFunction, Request, Response } from 'express';
import {
  createGovernment,
  getGovernments,
  getGovernmentById,
  updateGovernment,
  deleteGovernment
} from './government.controller';

const router = express.Router();

router.post('/', (req:Request,res:Response)=>{
    createGovernment(req, res)
});
router.get('/', getGovernments);
router.get('/:id', (req:Request,res:Response)=>{
    getGovernmentById(req, res)
});
router.put('/:id', updateGovernment);
router.delete('/:id', deleteGovernment);

export default router;
