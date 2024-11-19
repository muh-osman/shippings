import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useSendSingleSmsApi = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("api/send-single-sms", formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success("SMS sent successfully");
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
