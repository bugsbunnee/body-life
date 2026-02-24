import { type RouteObject, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './constants';

import ChatBot from '@/components/chat/chat-bot';
import ErrorPage from '@/pages/ErrorPage';
import Dashboard from '@/pages/Dashboard';
import DepartmentPage from '@/pages/DepartmentPage';
import FirstTimersPage from '@/pages/FirstTimersPage';
import HomePage from '@/pages/HomePage';
import InventoryPage from '@/pages/InventoryPage';
import LoginPage from '@/pages/LoginPage';
import MessagesPage from '@/pages/MessagesPage';
import PrayerCellsPage from '@/pages/PrayerCellsPage';
import ProgramsPage from '@/pages/ProgramsPage';
import PublicRoute from '@/pages/PublicRoute';
import ResetPassword from '@/pages/ResetPasswordPage';
import ServiceReportPage from '@/pages/ServiceReportPage';
import UsersPage from '@/pages/UsersPage';
import UnsubscribePage from '@/pages/UnsubscribePage';
import WeeklyReviewPage from '@/pages/WeeklyReviewPage';

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
            index: true,
            path: APP_ROUTES.AUTH,
            element: <LoginPage />,
         },
         {
            path: APP_ROUTES.SETUP_PASSWORD,
            element: <ResetPassword />,
         },
         {
            path: APP_ROUTES.UNSUBSCRIBE,
            element: <UnsubscribePage />,
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
            path: APP_ROUTES.PROGRAMS,
            element: <ProgramsPage />,
         },
         {
            path: APP_ROUTES.SERVICE_REPORT,
            element: <ServiceReportPage />,
         },
         {
            path: APP_ROUTES.WEEKLY_REPORTS,
            element: <WeeklyReviewPage />,
         },
         {
            path: APP_ROUTES.MESSAGES,
            element: <MessagesPage />,
         },
      ],
   },
];

export default routes;
