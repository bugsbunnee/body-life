import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/next';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

import routes from './utils/router';

import 'react-loading-skeleton/dist/skeleton.css';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <RouterProvider router={createBrowserRouter(routes)} />
         <Analytics />
         <Toaster />
      </QueryClientProvider>
   </StrictMode>
);
