import toast from "react-hot-toast";

const baseStyle = {
  borderRadius: "8px",
  fontSize:     "14px",
  padding:      "10px 16px",
};

export const toastSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    style: { ...baseStyle, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
    iconTheme: { primary: "#16a34a", secondary: "#fff" },
  });
};

export const toastError = (message) => {
  toast.error(message, {
    duration: 3000,
    style: { ...baseStyle, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    iconTheme: { primary: "#dc2626", secondary: "#fff" },
  });
};

export const toastInfo = (message) => toast.info(message, {
  duration: 3000,
  style: { ...baseStyle, background: "#f0f9ff", color: "#1e40af", border: "1px solid #dbeafe" },
  iconTheme: { primary: "#3b82f6", secondary: "#fff" },
});