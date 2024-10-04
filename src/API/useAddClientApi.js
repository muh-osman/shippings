import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useAddClientApi = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("api/clients", formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Added successfully.");
      navigate("/dashboard");
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
