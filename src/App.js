import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// Pages & components
import Layout from "./Layout/Layout";
import HomeLayout from "./Layout/HomeLayout";
import Home from "./Pages/Home/Home";
import LogIn from "./Pages/LogIn/LogIn";
import SignUp from "./Pages/SignUp/SignUp";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Auth from "./Utils/Auth";
import NotAuth from "./Utils/NotAuth";
import DashboardLayout from "./Layout/DashboardLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound/NotFound";
import Uploaded from "./Pages/Dashboard/Uploaded/Uploaded";
import AddClient from "./Pages/Dashboard/AddClient/AddClient";
import EditClient from "./Pages/Dashboard/EditClient/EditClient";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route element={<NotAuth />}>
          {/* Start Check if login */}
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          {/* End Check if login */}
        </Route>

        <Route element={<Auth />}>
          {/* Start protected route */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-client" element={<AddClient />} />
            <Route path="edit-client/:id" element={<EditClient />} />
            <Route path="uploaded" element={<Uploaded />} />
          </Route>
          {/* End protected route */}
        </Route>

        {/* http://localhost:3000/verify-email?expires=XXX&hash=XXX&id=XXX&signature=XXX */}
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
