import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllUploadedClients } from "./useGetAllUploadedClientsApi";

export const useCheckStatusApi = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (dataId) => {
      const res = await API.post(`api/check-status-client`, dataId);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Status updated successfully.");
      qc.prefetchQuery({
        queryKey: ["AllUploadedClients"],
        queryFn: () => fetchAllUploadedClients(),
      });
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
