import _ from 'lodash';
import moment from 'moment';

import { faker } from '@faker-js/faker';
import * as XLSX from 'xlsx';

export function parseUsersFromFile(file: Express.Multer.File) {
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
            birthDay: moment(`${result['Birthday (Day)']}-${result['Birthday (Month)']}-${moment().year()}`, 'DD-MMMM-YYYY').toDate(),
            phoneNumber: result['Phone Number']?.toString() ?? faker.phone.number(),
            address: result['Home Address'] ?? faker.location.streetAddress({ useFullAddress: true }),
         }))
         .filter((user) => user.email);

      resolve(_.uniqBy(mappedResults, 'email'));
   });
}

export function convertSentenceToTitleCase(text: string) {
   return text
      .split(' ')
      .map((word) => _.capitalize(word))
      .join(' ');
}
