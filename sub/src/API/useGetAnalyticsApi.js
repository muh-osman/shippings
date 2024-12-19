import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllAnalytics = async (start_date, end_date) => {
  const res = await API.get(
    `api/analytics?start_date=${start_date}&end_date=${end_date}`
  );
  return res.data;
};

export default function useGetAnalyticsApi(start_date, end_date) {
  return useQuery({
    queryKey: ["AllAnalytics", start_date, end_date],
    queryFn: () => fetchAllAnalytics(start_date, end_date),
    enabled: !!start_date && !!end_date, // Only run the query if both dates are provided
  });
}
