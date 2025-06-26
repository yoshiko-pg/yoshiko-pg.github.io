import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import TalkDetail from './pages/TalkDetail';
import ScrollToTop from './components/ScrollToTop';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'talks/:slug',
        element: <TalkDetail />,
      },
      {
        path: 'talks/:slug/',
        element: <TalkDetail />,
      },
    ],
  },
]);