import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useEditClientApi = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post(`api/clients/${id}`, formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Updated successfully.");
      // Invalidate the query for the specific client to refetch the data
      queryClient.invalidateQueries(["client", id]);
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
