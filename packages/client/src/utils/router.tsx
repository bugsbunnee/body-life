import { type RouteObject, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './constants';

import ChatBot from '@/components/chat/chat-bot';
import ErrorPage from '@/pages/ErrorPage';
import Dashboard from '@/pages/Dashboard';
import DepartmentPage from '@/pages/DepartmentPage';
import HomePage from '@/pages/HomePage';
import FirstTimersPage from '@/pages/FirstTimersPage';
import LoginPage from '@/pages/LoginPage';
import MessagesPage from '@/pages/MessagesPage';
import PrayerCellsPage from '@/pages/PrayerCellsPage';
import PublicRoute from '@/pages/PublicRoute';
import ResetPassword from '@/pages/ResetPasswordPage';
import ServiceReportPage from '@/pages/ServiceReportPage';
import UsersPage from '@/pages/UsersPage';
import InventoryPage from '@/pages/InventoryPage';

const routes: RouteObject[] = [
   {
      path: '/',
      element: <PublicRoute />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/chat',
            element: <ChatBot />,
         },
         {
            path: APP_ROUTES.AUTH,
            element: <LoginPage />,
         },
         {
            path: APP_ROUTES.SETUP_PASSWORD,
            element: <ResetPassword />,
         },
         {
            path: '*',
            element: <Navigate to={APP_ROUTES.AUTH} />,
         },
      ],
   },
   {
      path: APP_ROUTES.DASHBOARD,
      element: <Dashboard />,
      errorElement: <ErrorPage />,
      children: [
         {
            index: true,
            element: <HomePage />,
         },
         {
            path: APP_ROUTES.DEPARTMENT,
            element: <DepartmentPage />,
         },
         {
            path: APP_ROUTES.INVENTORY,
            element: <InventoryPage />,
         },
         {
            path: APP_ROUTES.PRAYER_CELLS,
            element: <PrayerCellsPage />,
         },
         {
            path: APP_ROUTES.MEMBERS,
            element: <UsersPage />,
         },
         {
            path: APP_ROUTES.FIRST_TIMERS,
            element: <FirstTimersPage />,
         },
         {
            path: APP_ROUTES.SERVICE_REPORT,
            element: <ServiceReportPage />,
         },
         {
            path: APP_ROUTES.MESSAGES,
            element: <MessagesPage />,
         },
      ],
   },
];

export default routes;
