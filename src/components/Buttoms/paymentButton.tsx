import { useState } from "react";
import DarkButton from "./DarkButtom";
import {
  CreatePaymentRequest,
  processPayment,
} from "@/services/paymentsService.service";

interface PaymentButtonProps {
  bookingData: CreatePaymentRequest;
  disabled?: boolean;
  isDataConfirmed?: boolean;
  className?: string;
}

export default function PaymentButton({
  bookingData,
  disabled,
  isDataConfirmed = true,
  className,
}: PaymentButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!bookingData.propertyId || !bookingData.userId) {
      setError("Faltan datos necesarios para procesar el pago");
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError("Debes seleccionar las fechas de la reserva");
      return;
    }

    if (!bookingData.guests || bookingData.guests < 1) {
      setError("Debes especificar el número de huéspedes");
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DarkButton
        text="Realizar pago"
        onClick={handlePayment}
        type="button"
        disabled={disabled || !isDataConfirmed}
        className={className}
      />

      {error && (
        <p className="text-red-600 text-sm font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
