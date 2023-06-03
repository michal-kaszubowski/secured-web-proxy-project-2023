import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './error-page';
import Root from './routes/Root';
import Auth from './routes/Auth';
import User from './routes/User';
import Admin from './routes/Admin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/oauth',
        element: <Auth />
      },
      {
        path: '/app/user/:userId',
        element: <User />
      },
      {
        path: '/app/admin/:adminId',
        element: <Admin />
      }
    ]
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
