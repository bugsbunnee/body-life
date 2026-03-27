import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { programRepository } from '../repositories/program.repository';

import { ProgramQuerySchema } from '../infrastructure/database/validators/program.validator';
import { uploadStream } from '../services/cloudinary.service';
import { lib } from '../utils/lib';
import { communicationService } from '../services/communication.service';

export const programController = {
   async createProgram(req: Request, res: Response) {
      try {
         if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please upload a valid file!' });
         }

         const response = await uploadStream(req.file.buffer);

         if (!response) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Could not upload the image!' });
         }

         req.body.imageUrl = response.secure_url;

         const program = await programRepository.createProgram(req.body);

         if (req.body.sendReminder.trim() === '1') {
            await communicationService.sendOutProgramReminder(program);
         }

         res.status(StatusCodes.CREATED).json({ data: program });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not create the program',
         });
      }
   },

   async sendReminderForProgram(req: Request, res: Response) {
      const program = await programRepository.getProgramById(req.params.id!);

      if (!program) {
         return res.status(StatusCodes.NOT_FOUND).json({ message: 'The program with the given ID could not be found.' });
      }

      if (!program.isActive) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The program is not active. Reminders can only be sent for active programs.' });
      }

      await communicationService.sendOutProgramReminder(program);

      res.json({ success: true, message: 'Reminders have been sent out for the program.' });
   },

   async getPrograms(req: Request, res: Response) {
      try {
         const query = ProgramQuerySchema.parse(req.query);
         const programs = await programRepository.getPrograms(req.pagination, query);

         res.json({ data: programs });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not fetch the programs',
         });
      }
   },

   async deactivateProgram(req: Request, res: Response) {
      try {
         const programId = lib.parseObjectId(req.params.id!);
         const program = await programRepository.deactivateProgram(programId);

         res.json({ data: program });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not deactivate the program',
         });
      }
   },
};
