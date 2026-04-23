import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./components/ui/Loader";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TaskDetailsPage = lazy(() => import("./pages/TaskDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const App = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader label="Loading page..." /></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
