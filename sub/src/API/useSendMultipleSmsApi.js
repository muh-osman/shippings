import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useSendMultipleSmsApi = () => {
  return useMutation({
    mutationFn: async (formData) => {
      // console.log(formData.get("message"));
      // console.log(formData.get("mobileNumbers"));
      const res = await API.post("api/send-multiple-sms", formData);
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
