// utils/toast.ts
import toast from "react-hot-toast";

// Helper de toasts con estilos de Volantia
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        fontFamily: "var(--font-montserrat)",
        fontSize: "16px",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "16px 20px",
        background: "#141e61",
        color: "#eaeaea",
        border: "2px solid #d3e4ff",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#ffffff",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      style: {
        fontFamily: "var(--font-montserrat)",
        fontSize: "16px",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "16px 20px",
        background: "#a10b0b",
        color: "#eaeaea",
        border: "2px solid #ff6b6b",
      },
      iconTheme: {
        primary: "#ffffff",
        secondary: "#a10b0b",
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      duration: 4500,
      icon: "⚠️",
      style: {
        fontFamily: "var(--font-montserrat)",
        fontSize: "16px",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "16px 20px",
        background: "#f59e0b",
        color: "#ffffff",
        border: "2px solid #fbbf24",
      },
    });
  },

  validation: (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        fontFamily: "var(--font-montserrat)",
        fontSize: "16px",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "16px 20px",
        background: "#0f044c",
        color: "#eaeaea",
        border: "2px solid #787a91",
      },
      iconTheme: {
        primary: "#787a91",
        secondary: "#ffffff",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        fontFamily: "var(--font-montserrat)",
        fontSize: "16px",
        fontWeight: "500",
        borderRadius: "12px",
        padding: "16px 20px",
        background: "#141e61",
        color: "#eaeaea",
      },
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};

// Helper para errores de validación con iconos
export const showValidationError = (error: string) => {
  const errorMessages: Record<string, string> = {
    "Por favor, elige fechas actuales o futuras":
      "📅 Por favor, elige fechas actuales o futuras",
    "El auto no está disponible en esa fecha":
      "🚗 El auto no está disponible en esa fecha",
    "El monto mínimo de reserva es $1,000":
      "💰 El monto mínimo de reserva es $1,000",
    "La fecha de término debe ser posterior a la fecha de inicio":
      "📆 La fecha de término debe ser posterior a la de inicio",
    "El período mínimo de renta es de 1 día":
      "⏱️ El período mínimo de renta es de 1 día",
  };

  const customMessage = errorMessages[error] || error;
  showToast.validation(customMessage);
};
