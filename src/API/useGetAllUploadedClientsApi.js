import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllUploadedClients = async () => {
  const res = await API.get(`api/uploaded-clients`);
  return res.data;
};

export default function useGetAllUploadedClientsApi() {
  return useQuery({
    queryKey: ["AllUploadedClients"],
    queryFn: () => fetchAllUploadedClients(),
  });
}
