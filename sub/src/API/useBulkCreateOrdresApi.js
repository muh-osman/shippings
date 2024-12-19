import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllClient } from "./useGetAllClientsApi";

export const useBulkCreateOrdresApi = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await API.post("api/bulk-create-orders");
      return res.data;
    },

    onSuccess: () => {
      toast.success("Uploaded orders successfully.");
      qc.prefetchQuery({
        queryKey: ["AllClients"],
        queryFn: () => fetchAllClient(),
      });
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";

      // Check if there are specific errors to display
      const errors = err?.response?.data?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((error) => {
          toast.error(`${error.path}: ${error.message}`);
        });
      } else {
        // Fallback to general error message
        toast.error(errorMessage);
      }
    },
  });
};
