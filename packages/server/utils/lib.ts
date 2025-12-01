import moment from 'moment';
import type { User } from '../generated/prisma';

export const lib = {
   formatDate(date: string | Date | number, format: string = 'DD MMM, YYYY') {
      return moment(date).format(format);
   },

   getBirthdayForUser(user: User) {
      const today = moment();
      const birthDate = moment(user.birthDay).set('year', today.year());

      if (birthDate.isAfter(today)) {
         return birthDate.set('year', today.year() + 1);
      }

      return birthDate;
   },

   checkDateIsExpired(date: Date) {
      return moment().diff(moment(date), 'hour') < 1;
   },
};
