import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import TalkDetail from './pages/TalkDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/talks/:slug',
    element: <TalkDetail />,
  },
]);