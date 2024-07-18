import React, { lazy, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { hideLoading, showLoading } from "./redux/rootReducer";
import LoadingBar from "react-top-loading-bar";
import LayoutLoader from "./components/DefaultLayout/LayoutLoader";
import ManagegStudents from "./pages/ADMIN/ManagegStudents/ManagegStudents.jsx";
import Placement from "./pages/ADMIN/Placement/Placement.jsx";
import PlacementList from "./pages/StudentDashboard/StudentDashboard.jsx";
import Notification from "./components/Notification/Notification.jsx";
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const AdminTable = lazy(() =>
  import("./pages/ADMIN/AdminTable/AdminTable.jsx")
);
const AdminHomePage = lazy(() =>
  import("./pages/ADMIN/AdminHomePage/AdminHomePage.jsx")
);

const Loader = () => <LayoutLoader />;

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.rootReducer.loading);
  const loadingBarRef = useRef(null);
  const location = useLocation();

  return (
    <>
      <LoadingBar color="#f11946" ref={loadingBarRef} />
      {loading && <Loader />}
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/register"
          element={
            <Suspense fallback={<Loader />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/notification"
          element={
            <Suspense fallback={<Loader />}>
              <Notification />
            </Suspense>
          }
        />
        <Route
          path="/student/placements"
          element={
            <Suspense fallback={<Loader />}>
              <PlacementList />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <AdminHomePage />
              </Suspense>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/manage-admins"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <AdminTable />
              </Suspense>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/manage-students"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <ManagegStudents />
              </Suspense>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/manage-placements"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <Placement />
              </Suspense>
            </ProtectedRoutes>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<Loader />}>
              <PageNotFound />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;

// eslint-disable-next-line react/prop-types
export const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("auth"));

  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
