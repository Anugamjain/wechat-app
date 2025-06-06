import "./App.css";
import Navigation from "./components/shared/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Activate from "./pages/Activate";
import Rooms from "./pages/Rooms";
import Room from './pages/Room';
import Authenticate from "./pages/Authenticate";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader";
import ProfilePage from "./pages/ProfilePage";

const Page = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};

const AppRoutes = () => {
  const SemiProtectedRoute = () => {
    const isAuth = useSelector((state) => state.auth.isAuth);
    const activated = useSelector((state) =>
      state.auth.user ? state.auth.user.activated : false
    );
    return isAuth ? (activated ? <Navigate to="/rooms" /> : <Outlet />) : <Navigate to="/authenticate" />;
  };

  const ProtectedRoute = () => {
    const isAuth = useSelector((state) => state.auth.isAuth);
    const activated = useSelector((state) =>
      state.auth.user ? state.auth.user.activated : false
    );

    return !isAuth ? (
      <Navigate to="/authenticate" />
    ) : !activated ? (
      <Navigate to="/activate" />
    ) : (
      <Outlet />
    );
  };

  const UnProtectedRoute = () => {
    const isAuth = useSelector((state) => state.auth.isAuth);
    const activated = useSelector((state) =>
      state.auth.user ? state.auth.user.activated : false
    );
    return isAuth ? (activated ? <Navigate to="/rooms" /> : <Navigate to="/activate" />) : <Outlet />;
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Page />,
        children: [
          {
            element: <UnProtectedRoute />,
            children: [
              { path: "/", element: <Home /> },
              { path: "/login", element: <Login /> },
              { path: "/authenticate", element: <Authenticate /> },
            ],
          },
          {
            element: <SemiProtectedRoute />,
            children: [{ path: "/activate", element: <Activate /> }],
          },
          {
            element: <ProtectedRoute />,
            children: [
              { path: '/update', element: <Activate/> },
              { path: "/rooms", element: <Rooms /> },
              { path: "/room/:id", element: <Room /> },
              { path: "/profile/:id", element: <ProfilePage /> },
            ],
          },
        ],
      },
    ],
    {
      future: {
        v7_startTransition: true, // already added for transitions
        v7_relativeSplatPath: true, // add this for relative splat paths
      },
    }
  );

  return <RouterProvider router={router} />;
};

function App() {
  const loading = useLoadingWithRefresh();
  return loading ? <Loader message={"Loading..."} /> : <AppRoutes />;
}

export default App;
