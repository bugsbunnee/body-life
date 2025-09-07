import type { Route } from './entities';
import { CiHome } from 'react-icons/ci';
import { BsFillPeopleFill } from 'react-icons/bs';
import { HiOutlineCog } from 'react-icons/hi';
import { MdOutlineContactSupport } from 'react-icons/md';

export const sections: Route[] = [
   {
      path: 'none',
      label: '',
      subroutes: [
         {
            path: '/dashboard',
            label: 'Home',
            Icon: CiHome,
         },
         {
            path: '/dashboard/members',
            label: 'Members',
            Icon: BsFillPeopleFill,
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
