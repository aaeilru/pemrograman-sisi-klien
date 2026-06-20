import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "../Apis/KelasApi";
import {
  toastSuccess,
  toastError,
} from "../Helpers/ToastHelpers";

export const useKelas = () => {
  return useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
    select: (res) => res?.data ?? [],
  });
};

export const useStoreKelas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kelas"],
      });
      toastSuccess("Data kelas berhasil ditambahkan.");
    },
    onError: () => {
      toastError("Gagal menambahkan data kelas.");
    },
  });
};

export const useUpdateKelas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kelas"],
      });
      toastSuccess("Data kelas berhasil diupdate.");
    },
    onError: () => {
      toastError("Gagal mengupdate data kelas.");
    },
  });
};

export const useDeleteKelas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kelas"],
      });
      toastSuccess("Data kelas berhasil dihapus.");
    },
    onError: () => {
      toastError("Gagal menghapus data kelas.");
    },
  });
};