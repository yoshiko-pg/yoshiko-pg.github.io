import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Talks from './pages/Talks';
import TalkDetail from './pages/TalkDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/talks',
    element: <Talks />,
  },
  {
    path: '/talks/:slug',
    element: <TalkDetail />,
  },
]);