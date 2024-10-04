import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchClientById = async (id) => {
  const res = await API.get(`api/clients/${id}`);
  return res.data;
};

export default function useGetOneClientDataApi() {
  let { id } = useParams();

  return useQuery({
    queryKey: ["client", id],
    queryFn: () => fetchClientById(id),
  });
}
