import type { User } from '../generated/prisma';
import { google } from 'googleapis';
import { lib } from '../utils/lib';

import path from 'path';

const oAuthClient = new google.auth.OAuth2({
   clientId: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const jwtClient = new google.auth.JWT({
   keyFile: path.join(process.cwd(), 'public', 'data', 'birthday-integration-479116-ce6de90fbd48.json'),
   scopes: ['https://www.googleapis.com/auth/calendar'],
});

const googleCalendar = google.calendar({ version: 'v3', auth: jwtClient });

export const googleService = {
   async authenticate() {
      return jwtClient.authorize();
   },

   async getAuthUrl() {
      return oAuthClient.generateAuthUrl({
         access_type: 'offline',
         scope: ['https://www.googleapis.com/auth/calendar'],
         prompt: 'consent',
      });
   },

   async getToken(code: string) {
      const { tokens } = await oAuthClient.getToken(code);
      oAuthClient.setCredentials(tokens);

      return tokens;
   },

   async createCalendar() {
      await jwtClient.authorize();

      const response = await googleCalendar.calendars.insert({
         requestBody: {
            summary: 'Birthdays',
            timeZone: 'Africa/Lagos',
         },
      });

      return response.data;
   },

   async scheduleBirthdayForUser(user: User) {
      this.authenticate();

      const calendar = await this.createCalendar();

      try {
         const response = await googleCalendar.events.insert({
            calendarId: calendar.id!,
            sendUpdates: 'all',
            requestBody: {
               summary: `Birthday Celebration Notification for ${user.firstName} ${user.lastName}`,
               description: 'Creating automated birthday celebration.',
               visibility: 'public',
               guestsCanInviteOthers: false,
               guestsCanModify: false,
               locked: true,

               recurrence: ['RRULE:FREQ=YEARLY'],

               reminders: {
                  overrides: [{ method: 'email', minutes: 1440 }],
                  useDefault: false,
               },

               source: {
                  title: 'Body Life App',
                  url: 'http://localhost:19200/api/birthday',
               },

               start: {
                  date: lib.getBirthdayForUser(user).startOf('day').format('YYYY-MM-DD'),
               },

               end: {
                  date: lib.getBirthdayForUser(user).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
               },
            },
         });

         return response;
      } catch (error) {
         console.log(error.response.data.error.errors);
      }
   },

   async deleteBirthdayEvent(eventId: string) {
      return googleCalendar.events.delete({
         calendarId: 'primary',
         eventId: eventId,
         sendUpdates: 'none',
      });
   },
};
