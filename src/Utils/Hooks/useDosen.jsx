import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "../Apis/DosenApi";
import {
  toastSuccess,
  toastError,
} from "../Helpers/ToastHelpers";

export const useDosen = (params = {}) => {
  return useQuery({
    queryKey: ["dosen", params],
    queryFn: () => getAllDosen(params),
    select: (res) => ({
      data: res?.data ?? [],
      total: Number(res?.headers?.["x-total-count"] ?? 0),
    }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useStoreDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Data dosen berhasil ditambahkan.");
    },
    onError: () => toastError("Gagal menambahkan data dosen."),
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Data dosen berhasil diupdate.");
    },
    onError: () => toastError("Gagal mengupdate data dosen."),
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Data dosen berhasil dihapus.");
    },
    onError: () => toastError("Gagal menghapus data dosen."),
  });
};