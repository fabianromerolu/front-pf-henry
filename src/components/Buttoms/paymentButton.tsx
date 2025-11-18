import { useState } from "react";
import DarkButton from "./DarkButtom";
import { processPayment } from "@/services/paymentsService.service";

interface PaymentButtonProps {
  bookingData: {
    bookingId: string;
    propertyId: string;
    userId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
  } | null;
  disabled?: boolean;
  isDataConfirmed?: boolean;
  className?: string;
  onCreateBooking?: () => void;
}

export default function PaymentButton({
  bookingData,
  disabled,
  isDataConfirmed = true,
  className,
  onCreateBooking,
}: PaymentButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!bookingData && onCreateBooking) {
      onCreateBooking();
      return;
    }

    if (!bookingData) {
      setError("No se encontraron los datos de la reserva");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await processPayment(bookingData);
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
          !bookingData
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
