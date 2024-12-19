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
import Search from "./Pages/Dashboard/Search/Search";
import Order from "./Pages/Dashboard/Order/Order";
import Sms from "./Pages/Dashboard/Sms/Sms";
import Analytics from "./Pages/Dashboard/Analytics/Analytics";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={`${process.env.PUBLIC_URL}/`} element={<Layout />}>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route element={<NotAuth />}>
          {/* Start Check if login */}
          <Route path={`${process.env.PUBLIC_URL}/login`} element={<LogIn />} />
          <Route path={`${process.env.PUBLIC_URL}/signup`} element={<SignUp />} />
          <Route path={`${process.env.PUBLIC_URL}/forgot-password`} element={<ForgotPassword />} />
          <Route path={`${process.env.PUBLIC_URL}/reset-password`} element={<ResetPassword />} />
          {/* End Check if login */}
        </Route>

        <Route element={<Auth />}>
          {/* Start protected route */}
          <Route path={`${process.env.PUBLIC_URL}/dashboard`} element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-client" element={<AddClient />} />
            <Route path="edit-client/:id" element={<EditClient />} />
            <Route path="order/:id" element={<Order />} />
            <Route path="uploaded" element={<Uploaded />} />
            <Route path="search" element={<Search />} />
            <Route path="sms" element={<Sms />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          {/* End protected route */}
        </Route>

        {/* http://localhost:3000/verify-email?expires=XXX&hash=XXX&id=XXX&signature=XXX */}
        <Route path={`${process.env.PUBLIC_URL}/verify-email`} element={<VerifyEmail />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    )
  );

  return <RouterProvider router={router} basename="/sub" />;
}
