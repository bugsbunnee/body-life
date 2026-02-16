import { type RouteObject } from 'react-router-dom';
import { APP_ROUTES } from './constants';

import ChatBot from '@/components/chat/chat-bot';
import ErrorPage from '@/pages/ErrorPage';
import Dashboard from '@/pages/Dashboard';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import MessagesPage from '@/pages/MessagesPage';
import ResetPassword from '@/pages/ResetPasswordPage';
import ServiceReportPage from '@/pages/ServiceReportPage';
import UsersPage from '@/pages/UsersPage';

const routes: RouteObject[] = [
   {
      path: '/',
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
            path: APP_ROUTES.MEMBERS,
            element: <UsersPage />,
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
