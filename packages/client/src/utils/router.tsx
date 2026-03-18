import { type RouteObject, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './constants';

import ChatBot from '@/components/chat/chat-bot';
import ErrorPage from '@/pages/ErrorPage';
import Dashboard from '@/pages/Dashboard';
import DepartmentPage from '@/pages/DepartmentPage';
import FirstTimersPage from '@/pages/FirstTimersPage';
import HomePage from '@/pages/HomePage';
import InventoryPage from '@/pages/InventoryPage';
import LandingPage from '@/pages/LandingPage';
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
      errorElement: <ErrorPage />,
      children: [
         {
            index: true,
            element: <LandingPage />,
         },
         {
            path: APP_ROUTES.UNSUBSCRIBE,
            element: <UnsubscribePage />,
         },
      ],
   },
   {
      path: '/admin',
      element: <PublicRoute />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: APP_ROUTES.CHAT,
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
            path: 'dashboard',
            element: <Dashboard />,
            errorElement: <ErrorPage />,
            children: [
               {
                  index: true,
                  element: <HomePage />,
               },
               {
                  path: 'departments',
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
         {
            path: '*',
            element: <Navigate to={APP_ROUTES.AUTH} replace />,
         },
      ],
   },
];

export default routes;
