import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Context
import { useAuth } from "../Context/AuthContext";

export const useCheckPinApi = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/check-pin", data);
      return res.data;
    },

    onSuccess: (responseData) => {
      if (responseData.success) {
        setIsAuthenticated(true);
      }
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
