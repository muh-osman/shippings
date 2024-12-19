import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function Auth() {
  const [cookies, setCookie] = useCookies(["tokens"]);

  // console.log(cookies.tokens);

  return !cookies.tokens ? (
    <Outlet />
  ) : (
    <Navigate to={`${process.env.PUBLIC_URL}/dashboard`} />
  );
}
