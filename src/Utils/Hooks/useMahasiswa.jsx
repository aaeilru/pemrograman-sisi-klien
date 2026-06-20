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

export const useMahasiswa = () => {
  return useQuery({
    queryKey: ["mahasiswa"],
    queryFn: getAllMahasiswa,
    select: (res) => res?.data ?? [],
  });
};

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });
      toastSuccess("Data mahasiswa berhasil ditambahkan.");
    },
    onError: () => {
      toastError("Gagal menambahkan data mahasiswa.");
    },
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });
      toastSuccess("Data mahasiswa berhasil diupdate.");
    },
    onError: () => {
      toastError("Gagal mengupdate data mahasiswa.");
    },
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });
      toastSuccess("Data mahasiswa berhasil dihapus.");
    },
    onError: () => {
      toastError("Gagal menghapus data mahasiswa.");
    },
  });
};