import { useMutation } from "@tanstack/react-query";
//
import { useNavigate } from "react-router-dom";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";
// Toastify
import { toast } from "react-toastify";

export const useSignUpApi = () => {
  //
  const navigate = useNavigate();
  // Cookies
  const [cookies, setCookie] = useCookies(["tokens"]);

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/register", data);
      return res.data;
    },

    onSuccess: (responseData) => {
      setCookie("tokens", responseData.token, { path: "/sub" });
      navigate(`${process.env.PUBLIC_URL}/dashboard`, { replace: true });
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    },
  });
};
