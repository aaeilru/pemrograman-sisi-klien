import { useQuery } from "@tanstack/react-query";
import { getAllChartData } from "../Apis/ChartApi";

export const useChartData = () => {
  return useQuery({
    queryKey: ["chart", "all"],
    queryFn: getAllChartData,
    select: (res) => res?.data ?? {},
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};