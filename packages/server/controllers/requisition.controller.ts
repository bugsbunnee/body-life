import moment from 'moment';
import _ from 'lodash';

import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { departmentRepository } from '../repositories/department.repository';
import { requisitionRepository } from '../repositories/requisition.repository';
import { communicationService } from '../services/communication.service';
import { RequisitionStatus } from '../infrastructure/database/entities/enums/requisition-status.enum';
import { lib } from '../utils/lib';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

export const requisitionsController = {
   async getRequisitions(req: Request, res: Response) {
      try {
         const query = requisitionRepository.parseRequisitionQueryFromRequest(req);
         const result = await requisitionRepository.getRequisitions(req.pagination, query);

         return res.json(result);
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (<Error>ex).message });
      }
   },

   async createRequisition(req: Request, res: Response) {
      if (req.admin.userRole === UserRole.Hod && req.body.department !== req.admin.department) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You can only create inventory for your department.' });
      }

      const department = await departmentRepository.getOneDepartment(req.body.department);

      if (!department) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Department Provided.' });
      }

      req.body.requester = req.admin._id;

      const [requisition] = await Promise.all([
         requisitionRepository.createRequisition(req.body),
         communicationService.sendOutRequisitionApprovalRequest({
            amount: req.body.amount,
            description: req.body.description,
            requesterFirstName: req.admin.firstName,
            requesterDepartmentName: department.name,
         }),
      ]);

      res.status(StatusCodes.CREATED).json(requisition);
   },

   async actionRequisition(req: Request, res: Response) {
      let requisitionId = lib.parseObjectId(req.params.id!);
      let requisition = await requisitionRepository.getOneRequisition(requisitionId);

      if (!requisition) {
         return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid Requisition ID Provided.' });
      }

      if (requisition.status === req.body.status) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You cannot update a requisition with the same status.' });
      }

      const isActioned = requisitionRepository.checkRequisitionIsActioned(requisition);

      if (isActioned) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The requisition has already been actioned.' });
      }

      switch (req.body.status) {
         case RequisitionStatus.Approved:
            requisition.status = RequisitionStatus.Approved;
            requisition.approvedAt = moment().toDate();

            break;
         case RequisitionStatus.Rejected:
            requisition.status = RequisitionStatus.Rejected;
            requisition.rejectedAt = moment().toDate();

            break;
         case RequisitionStatus.Disbursed:
            requisition.status = RequisitionStatus.Disbursed;
            requisition.disbursedAt = moment().toDate();

            break;
         default:
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid status provided.' });
      }

      requisition.actioner = req.admin._id;
      requisition = await requisition.save();

      await communicationService.sendOutRequisitionUpdateRequest({
         userFirstName: _.get(requisition, 'requester.firstName') as unknown as string,
         userEmail: _.get(requisition, 'requester.email') as unknown as string,
         amount: requisition.amount,
         description: requisition.description,
         requesterFirstName: _.get(requisition, 'requester.firstName') as unknown as string,
         requesterDepartmentName: _.get(requisition, 'department.name') as unknown as string,
         status: requisition.status,
      });

      res.status(StatusCodes.OK).json(requisition);
   },
};
