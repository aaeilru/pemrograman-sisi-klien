import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "../Apis/MataKuliahApi";
import {
  toastSuccess,
  toastError,
} from "../Helpers/ToastHelpers";

export const useMataKuliah = (user, params = {}) => {
  const queryParams =
    user?.role === "dosen"
      ? {
          ...params,
          dosenId: user.dosenId,
        }
      : params;

  return useQuery({
    queryKey: ["mata-kuliah", user?.role, user?.dosenId, queryParams],
    queryFn: () => getAllMataKuliah(queryParams),
    enabled: !!user,
    select: (res) => ({
      data: res?.data ?? [],
      total: Number(res?.headers?.["x-total-count"] ?? 0),
    }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useStoreMataKuliah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil ditambahkan.");
    },
    onError: () => toastError("Gagal menambahkan mata kuliah."),
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil diupdate.");
    },
    onError: () => toastError("Gagal mengupdate mata kuliah."),
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil dihapus.");
    },
    onError: () => toastError("Gagal menghapus mata kuliah."),
  });
};