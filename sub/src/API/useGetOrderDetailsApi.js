import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// API
import API from "./Api";

export const fetchAOrderDetails = async (id) => {
  const res = await API.get(`api/show-one-order-details/${id}`);
  return res.data;
};

export default function useGetOrderDetailsApi() {
  let { id } = useParams();
  return useQuery({
    queryKey: ["OrderDetails", id],
    queryFn: () => fetchAOrderDetails(id),
  });
}
