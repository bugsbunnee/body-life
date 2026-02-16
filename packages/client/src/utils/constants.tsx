import type { Route } from './entities';
import { Cross } from 'lucide-react';
import { CiHome } from 'react-icons/ci';
import { BsFillPeopleFill } from 'react-icons/bs';
import { HiOutlineCog } from 'react-icons/hi';
import { MdOutlineContactSupport, MdReport } from 'react-icons/md';

export const APP_ROUTES = {
   AUTH: '/auth',
   DASHBOARD: '/dashboard',
   FIRST_TIMERS: '/dashboard/first-timers',
   FORGOT_PASSWORD: '/forgot-password',
   MESSAGES: '/dashboard/messages',
   MEMBERS: '/dashboard/members',
   SETUP_PASSWORD: '/reset-password',
   SERVICE_REPORT: '/dashboard/service-report',
};

export const sections: Route[] = [
   {
      path: 'none',
      label: '',
      subroutes: [
         {
            path: APP_ROUTES.DASHBOARD,
            label: 'Home',
            Icon: CiHome,
         },
         {
            path: APP_ROUTES.MEMBERS,
            label: 'Members',
            Icon: BsFillPeopleFill,
         },
         {
            path: APP_ROUTES.SERVICE_REPORT,
            label: 'Service Report',
            Icon: MdReport,
         },
         {
            path: APP_ROUTES.MESSAGES,
            label: 'Messages',
            Icon: Cross,
         },
      ],
   },
   {
      path: 'none',
      label: 'Account Pages',
      subroutes: [
         {
            path: '/settings',
            label: 'Settings',
            Icon: HiOutlineCog,
         },
      ],
   },
   {
      path: 'none',
      label: 'Help',
      subroutes: [
         {
            path: '/support',
            label: 'Support',
            Icon: MdOutlineContactSupport,
         },
      ],
   },
];
