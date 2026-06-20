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

export const useDosen = () => {
  return useQuery({
    queryKey: ["dosen"],
    queryFn: getAllDosen,
    select: (res) => res?.data ?? [],
  });
};

export const useStoreDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dosen"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toastSuccess("Data dosen berhasil ditambahkan.");
    },
    onError: () => {
      toastError("Gagal menambahkan data dosen.");
    },
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dosen"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toastSuccess("Data dosen berhasil diupdate.");
    },
    onError: () => {
      toastError("Gagal mengupdate data dosen.");
    },
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dosen"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toastSuccess("Data dosen berhasil dihapus.");
    },
    onError: () => {
      toastError("Gagal menghapus data dosen.");
    },
  });
};