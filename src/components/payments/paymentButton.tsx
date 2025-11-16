import { processPayment } from "@/services/paymentsService.service";
import { useState } from "react";
import DarkButton from "../Buttoms/DarkButtom";

interface PaymentButtonProps {
  bookingId: string | null;
  disabled?: boolean;
  isDataConfirmed?: boolean;
  className?: string;
  onCreateBooking?: () => void;
}

export default function PaymentButton({
  bookingId,
  disabled,
  isDataConfirmed = true,
  className,
  onCreateBooking,
}: PaymentButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!bookingId && onCreateBooking) {
      onCreateBooking();
      return;
    }

    if (!bookingId) {
      setError("No se encontró el ID de la reserva");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await processPayment(bookingId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar el pago"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DarkButton
        text={
          !bookingId
            ? "Crear reserva"
            : isSubmitting
            ? "Procesando..."
            : "Realizar pago"
        }
        onClick={handlePayment}
        type="button"
        disabled={isSubmitting || disabled || !isDataConfirmed}
        className={className}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
