import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllClient = async () => {
  const res = await API.get(`api/clients`);
  return res.data;
};

export default function useGetAllClientsApi() {
  return useQuery({
    queryKey: ["AllClients"],
    queryFn: () => fetchAllClient(),
  });
}
