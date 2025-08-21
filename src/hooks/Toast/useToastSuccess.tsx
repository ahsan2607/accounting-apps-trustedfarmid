import { useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "./toastConfig";

export const useToastSuccess = () => {
  return useCallback((message: string) => {
    toast.success(<span>{message}</span>, {
      ...toastConfig,
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      ),
      style: {
        backgroundColor: "#34D399",
        color: "white",
        borderRadius: "8px",
        padding: "10px 15px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    });
  }, []);
};
