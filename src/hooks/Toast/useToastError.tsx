// hooks/useCustomToast.ts
import { useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "./toastConfig";

export const useToastError = () => {
  return useCallback((message: string) => {
    toast.error(<span>{message}</span>, {
      ...toastConfig,
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      ),
      style: {
        backgroundColor: "#EF4444",
        color: "white",
        borderRadius: "8px",
        padding: "10px 15px",
      },
    });
  }, []);
};
