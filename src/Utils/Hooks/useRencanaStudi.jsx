import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllRencanaStudi,
  storeRencanaStudi,
  updateRencanaStudi,
  deleteRencanaStudi,
} from "../Apis/RencanaStudiApi";
import {
  toastSuccess,
  toastError,
} from "../Helpers/ToastHelpers";

export const useRencanaStudi = () => {
  return useQuery({
    queryKey: ["rencana-studi"],
    queryFn: getAllRencanaStudi,
    select: (res) => ({
      data: res?.data ?? [],
    }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useStoreRencanaStudi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeRencanaStudi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencana-studi"] });
      toastSuccess("Kelas rencana studi berhasil ditambahkan.");
    },
    onError: () => toastError("Gagal menambahkan kelas rencana studi."),
  });
};

export const useUpdateRencanaStudi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRencanaStudi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencana-studi"] });
      toastSuccess("Rencana studi berhasil diperbarui.");
    },
    onError: () => toastError("Gagal memperbarui rencana studi."),
  });
};

export const useDeleteRencanaStudi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRencanaStudi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencana-studi"] });
      toastSuccess("Kelas rencana studi berhasil dihapus.");
    },
    onError: () => toastError("Gagal menghapus kelas rencana studi."),
  });
};