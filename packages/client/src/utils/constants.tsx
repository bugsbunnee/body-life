import type { Route } from './entities';
import { Cross, NewspaperIcon } from 'lucide-react';
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
            path: APP_ROUTES.FIRST_TIMERS,
            label: 'First Timers',
            Icon: NewspaperIcon,
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

export const CONTACT_METHODS = [
   {
      id: 'Call',
      name: 'Call',
   },
   {
      id: 'SMS',
      name: 'SMS',
   },
   {
      id: 'WhatsApp',
      name: 'WhatsApp',
   },
   {
      id: 'Email',
      name: 'Email',
   },
   {
      id: 'Visit',
      name: 'Visit',
   },
];

export const GENDERS = [
   {
      id: 'Male',
      name: 'Male',
   },
   {
      id: 'Female',
      name: 'Female',
   },
];

export const MARITAL_STATUS = [
   {
      id: 'Single',
      name: 'Single',
   },
   {
      id: 'Married',
      name: 'Married',
   },
];

export const FOLLOW_UP_STATUS = [
   {
      id: 'pending',
      name: 'pending',
   },
   {
      id: 'assigned',
      name: 'assigned',
   },
   {
      id: 'contacted',
      name: 'contacted',
   },
   {
      id: 'not-reachable',
      name: 'not-reachable',
   },
   {
      id: 'not-interested',
      name: 'not-interested',
   },
   {
      id: 'integrated',
      name: 'integrated',
   },
];

export const FOLLOW_UP_FEEDBACK_STATUS = [
   {
      id: 'contacted',
      name: 'contacted',
   },
   {
      id: 'not-reachable',
      name: 'not-reachable',
   },
   {
      id: 'not-interested',
      name: 'not-interested',
   },
   {
      id: 'integrated',
      name: 'integrated',
   },
];
