import { type RouteObject } from 'react-router-dom';

import ChatBot from '@/components/chat/chat-bot';
import ErrorPage from '@/pages/ErrorPage';
import Dashboard from '@/pages/Dashboard';
import LoginPage from '@/pages/LoginPage';
import PublicRoute from '@/pages/PublicRoute';
import UsersPage from '@/pages/UsersPage';
import MessagesPage from '@/pages/MessagesPage';

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
            path: '/auth',
            element: <LoginPage />,
         },
      ],
   },
   {
      path: '/dashboard',
      element: <Dashboard />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/dashboard/members',
            element: <UsersPage />,
         },
         {
            path: '/dashboard/messages',
            element: <MessagesPage />,
         },
      ],
   },
];

export default routes;
