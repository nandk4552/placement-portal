import React, { lazy, Suspense, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import LayoutLoader from "./components/DefaultLayout/LayoutLoader";
import Notification from "./components/Notification/Notification.jsx";
import ApplicantDetails from "./pages/ADMIN/ApplicantDetails/ApplicantDetails.jsx";
const ManageStudents = lazy(() =>
  import("./pages/ADMIN/ManageStudents/ManageStudents.jsx")
);
const ManagePlacement = lazy(() =>
  import("./pages/ADMIN/ManagePlacement/ManagePlacement.jsx")
);
const StudentDashboard = lazy(() =>
  import("./pages/StudentDashboard/StudentDashboard.jsx")
);
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
const MasterData = lazy(() => import("./pages/MasterData/MasterData"));
const AdminTable = lazy(() =>
  import("./pages/ADMIN/AdminTable/AdminTable.jsx")
);
const AdminDashboard = lazy(() =>
  import("./pages/ADMIN/AdminDashboard/AdminDashboard.jsx")
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
          path="/student/master-data"
          element={
            <Suspense fallback={<Loader />}>
              <MasterData />
            </Suspense>
          }
        />
        <Route
          path="/student/placements"
          element={
            <Suspense fallback={<Loader />}>
              <StudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <AdminDashboard />
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
                <ManageStudents />
              </Suspense>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/manage-placements"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <ManagePlacement />
              </Suspense>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/placements/:placementId/applicants"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<Loader />}>
                <ApplicantDetails />
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
