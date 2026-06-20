import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../Apis/MahasiswaApi";
import {
  toastSuccess,
  toastError,
} from "../Helpers/ToastHelpers";

export const useMahasiswa = (params = {}) => {
  return useQuery({
    queryKey: ["mahasiswa", params],
    queryFn: () => getAllMahasiswa(params),
    select: (res) => ({
      data: res?.data ?? [],
      total: Number(
        res?.headers?.["x-total-count"] ??
          res?.headers?.["X-Total-Count"] ??
          res?.data?.length ??
          0
      ),
    }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Data mahasiswa berhasil ditambahkan.");
    },
    onError: () => toastError("Gagal menambahkan data mahasiswa."),
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Data mahasiswa berhasil diupdate.");
    },
    onError: () => toastError("Gagal mengupdate data mahasiswa."),
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Data mahasiswa berhasil dihapus.");
    },
    onError: () => toastError("Gagal menghapus data mahasiswa."),
  });
};