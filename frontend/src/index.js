import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './error-page';
import StartView from './components/start/StartView';
import ControlPlane from './components/control-plane/ControlPlane';
import AuthorizationCodeInterceptor from './components/oauth/AuthorizationCodeInterceptor';
import AdminView from './components/admin/AdminView';
import UserView from './components/user/UserView';

console.log('index.js >> invoked');

const router = createBrowserRouter([
  {
    path: '/home',
    element: <StartView />,
    errorElement: <ErrorPage />
  },
  {
    path: '/control-plane',
    element: <ControlPlane />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'oauth/intercept',
        element: <AuthorizationCodeInterceptor />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminView />,
    errorElement: <ErrorPage />
  },
  {
    path: '/user',
    element: <UserView />,
    errorElement: <ErrorPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
