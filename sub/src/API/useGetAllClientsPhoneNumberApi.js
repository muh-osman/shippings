import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllClientPhoneNumber = async () => {
  const res = await API.get(`api/all-clients-phone-number`);
  return res.data;
};

export default function useGetAllClientsPhoneNumberApi() {
  return useQuery({
    queryKey: ["AllClientsPhoneNumber"],
    queryFn: () => fetchAllClientPhoneNumber(),
  });
}
