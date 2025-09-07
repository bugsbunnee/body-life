import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage: React.FC = () => {
   const error = useRouteError();

   return <>{isRouteErrorResponse(error) ? 'This page does not exist.' : 'An unexpected error occurred.'}</>;
};

export default ErrorPage;
