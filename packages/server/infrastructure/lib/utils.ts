import _ from 'lodash';
import moment from 'moment';
import * as XLSX from 'xlsx';

export function parseUsersFromFile(file: Express.Multer.File) {
   return new Promise((resolve) => {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0] as string;
      const workSheet = workbook.Sheets[sheetName];

      const results = XLSX.utils.sheet_to_json(workSheet!);

      const mappedResults = results.map((result: any) => ({
         firstName: result.Name.split(' ')[0],
         lastName: result.Name.split(' ')[1],
         phoneNumber: result.Number,
         address: result.Address,
         notes: result['Recommeded Cell'] ? `Recommended Cell: ${result['Recommeded Cell']}, ${result['Call Log 12th Feb']}` : '',
         dateVisited: result['Date Visited'] ? moment(result['Date Visited'] * 1_000).toDate() : moment().toDate(),
      }));

      resolve(mappedResults);
   });
}

export function convertSentenceToTitleCase(text: string) {
   return text
      .split(' ')
      .map((word) => _.capitalize(word))
      .join(' ');
}
