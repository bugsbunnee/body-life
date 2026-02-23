import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { programRepository } from '../repositories/program.repository';

import { ProgramQuerySchema } from '../infrastructure/database/validators/program.validator';
import { uploadStream } from '../services/cloudinary.service';
import { lib } from '../utils/lib';

export const programController = {
   async createProgram(req: Request, res: Response) {
      try {
         if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please upload a valid file!' });
         }

         console.log(req.file);
         const response = await uploadStream(req.file.buffer);

         if (!response) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Could not upload the image!' });
         }

         req.body.imageUrl = response.secure_url;

         const program = await programRepository.createProgram(req.body);
         res.status(StatusCodes.CREATED).json({ data: program });
      } catch (ex) {
         console.log(ex);
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not create the program',
         });
      }
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
