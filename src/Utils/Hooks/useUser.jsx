import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllUser,
  storeUser,
  updateUser,
  deleteUser,
} from "../Apis/UserApi";
import {
  toastSuccess,
  toastError,
} from "../Helpers/ToastHelpers";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
    select: (res) => res?.data ?? [],
  });
};

export const useStoreUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toastSuccess("User berhasil ditambahkan.");
    },
    onError: () => {
      toastError("Gagal menambahkan user.");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toastSuccess("User berhasil diupdate.");
    },
    onError: () => {
      toastError("Gagal mengupdate user.");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toastSuccess("User berhasil dihapus.");
    },
    onError: () => {
      toastError("Gagal menghapus user.");
    },
  });
};