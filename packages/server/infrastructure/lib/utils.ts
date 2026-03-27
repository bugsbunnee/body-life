import _ from 'lodash';
import moment from 'moment';
import parsePhoneNumberFromString from 'libphonenumber-js';
import csv from 'csv-parser';

import * as XLSX from 'xlsx';
import type { IUser } from '../database/models/user.model';

import { Readable } from 'stream';
import { faker } from '@faker-js/faker';

import { Gender } from '../database/entities/enums/gender.enum';
import { COUNTRY_CODE } from '../../utils/constants';
import { MaritalStatus } from '../database/entities/enums/marital-status.enum';
import { lib } from '../../utils/lib';

export function convertSentenceToTitleCase(text: string) {
   return text
      .split(' ')
      .map((word) => _.capitalize(word))
      .join(' ');
}

export function parseUsersFromExcelFile(file: Express.Multer.File) {
   return new Promise((resolve) => {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0] as string;
      const workSheet = workbook.Sheets[sheetName];

      const results = XLSX.utils.sheet_to_json(workSheet!);

      const mappedResults = results
         .map((result: any) => ({
            firstName: result['First Name'],
            lastName: result['Surname'],
            gender: result['Gender'],
            email: result['E-mail Address']?.trim()?.toLowerCase(),
            maritalStatus: result['Marital Status'],
            dateOfBirth: moment(`${result['Birthday (Day)']}-${result['Birthday (Month)']}-${moment().year()}`, 'DD-MMMM-YYYY').toDate(),
            phoneNumber: result['Phone Number']?.toString() ?? faker.phone.number(),
            address: result['Home Address'] ?? faker.location.streetAddress({ useFullAddress: true }),
         }))
         .filter((user) => user.email);

      resolve(_.uniqBy(mappedResults, 'email'));
   });
}

export function parseUsersFromCSVFile(file: Express.Multer.File) {
   return new Promise((resolve, reject) => {
      const results: Partial<IUser>[] = [];

      Readable.from(file.buffer)
         .pipe(csv())
         .on('data', (data) => {
            const gender = data['Gender'] ?? Gender.Male;
            const email = data['Email'];
            const phone = data['Phone'];

            const [firstName, middleName, lastName] = data['Full Name'].split(' ');

            if (email && phone) {
               const phoneNumber = parsePhoneNumberFromString(data['Phone'], COUNTRY_CODE);

               if (phoneNumber) {
                  results.push({
                     firstName,
                     lastName: lastName || middleName || faker.person.lastName(gender),
                     maritalStatus: data['Anniversary'] ? MaritalStatus.Married : MaritalStatus.Single,
                     email: data['Email'],
                     phoneNumber: lib.cleanPhoneNumber(phoneNumber.number),
                     dateOfBirth: moment(data['Birthday']).toDate(),
                     gender: gender,
                     address: faker.location.streetAddress({ useFullAddress: true }),
                     isFirstTimer: false,
                     isSubscribedToNewsletter: true,
                  });
               }
            }
         })
         .on('end', () => {
            const uniqueByEmail = _.uniqBy(results, 'email');
            const uniqueByPhone = _.uniqBy(uniqueByEmail, 'phoneNumber');

            resolve(uniqueByPhone);
         })
         .on('error', reject);
   });
}

export function parseUsersFromFile(file: Express.Multer.File) {
   const extension = file.originalname.split('.').at(-1);

   if (extension === 'csv') {
      return parseUsersFromCSVFile(file);
   }

   return parseUsersFromExcelFile(file);
}
