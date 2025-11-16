/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  createBooking,
  calculateBookingDuration,
} from "@/services/bookingService.service";
import { processPayment } from "@/services/paymentsService.service";
import { BookingValidationSchema } from "@/validators/BookingSchema";
import "react-datepicker/dist/react-datepicker.css";
import BookingDates from "./BookingDates";
import PersonalInfoCheckout from "./PersonalInfoCheckout";
import DarkButton from "../Buttoms/DarkButtom";

interface BookingCheckoutFormProps {
  vehicleId: string;
  vehicleName: string;
  vehiclePrice: number;
  vehicleImage?: string;
}

export default function BookingForm({
  vehicleId,
  vehiclePrice,
}: BookingCheckoutFormProps) {
  const AuthUser = useAuth();
  const router = useRouter();

  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseDDMMYYYYToISO = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) {
      throw new Error("Formato de fecha inválido. Use DD/MM/AAAA");
    }
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const calculateTotalPrice = () => {
    if (!formik.values.startDate || !formik.values.endDate) return 0;

    try {
      const startISO = parseDDMMYYYYToISO(formik.values.startDate);
      const endISO = parseDDMMYYYYToISO(formik.values.endDate);
      const days = calculateBookingDuration(startISO, endISO);
      return days * vehiclePrice;
    } catch {
      return 0;
    }
  };

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    validationSchema: BookingValidationSchema,
    onSubmit: async (values) => {
      const token = AuthUser?.token;
      const userId = AuthUser?.user?.id;

      if (!token || !userId) {
        alert("Debes iniciar sesión para hacer una reserva");
        router.push("/login");
        return;
      }

      if (!isDataConfirmed) {
        alert("Por favor confirma que los datos son correctos");
        return;
      }

      setIsSubmitting(true);

      try {
        const startISO = parseDDMMYYYYToISO(values.startDate);
        const endISO = parseDDMMYYYYToISO(values.endDate);

        // Validar monto mínimo para Mercado Pago
        const calculatedTotal = calculateTotalPrice();
        if (calculatedTotal < 1000) {
          alert(
            `El monto de la reserva (${calculatedTotal}) es muy bajo para procesarse por Mercado Pago. El mínimo es $1,000 COP.\n\nPor favor, extiende las fechas de tu reserva.`
          );
          setIsSubmitting(false);
          return;
        }

        console.log("📤 Enviando datos al backend:", {
          userId,
          pinId: vehicleId,
          start_date: startISO,
          end_date: endISO,
        });

        // 1. Crear la reserva
        const response = await createBooking(
          {
            userId,
            pinId: vehicleId,
            start_date: startISO,
            end_date: endISO,
          },
          token
        );

        // 2. Extraer el bookingId de la respuesta
        const responseAny = response as any;

        if (responseAny && typeof responseAny === "object") {
          console.log("📦 Respuesta del backend:");
          for (const [key, value] of Object.entries(responseAny)) {
            console.log(`  - ${key}:`, value);
          }
        }

        let extractedId = null;

        if (response?.id) {
          extractedId = response.id;
        } else if (responseAny?._id) {
          extractedId = responseAny._id;
        } else if (responseAny?.data?.id) {
          extractedId = responseAny.data.id;
        } else if (responseAny?.booking?.id) {
          extractedId = responseAny.booking.id;
        } else if (typeof responseAny === "string") {
          extractedId = responseAny;
        }

        if (!extractedId) {
          throw new Error(
            "No se pudo obtener el ID de la reserva del servidor"
          );
        }

        console.log("✅ Reserva creada con ID:", extractedId);

        // 3. Redirigir automáticamente a Mercado Pago
        console.log("🚀 Redirigiendo a Mercado Pago...");

        try {
          await processPayment(extractedId);
          // Si llegamos aquí es porque hubo un error (no debería pasar porque processPayment redirige)
        } catch (paymentError) {
          console.error("💥 Error al procesar el pago:", paymentError);

          // Mostrar mensaje más específico
          const errorMessage =
            paymentError instanceof Error
              ? paymentError.message
              : "Error al conectar con Mercado Pago";

          alert(
            `La reserva se creó exitosamente (ID: ${extractedId}), pero hubo un problema al procesar el pago:\n\n${errorMessage}\n\nPor favor, contacta al soporte con tu ID de reserva.`
          );

          // Opcional: redirigir a "mis reservas" para que vea su reserva creada
          router.push("/my-bookings");
        }
      } catch (error) {
        console.error("💥 Error al crear reserva:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Error al procesar la reserva"
        );
        setIsSubmitting(false);
      }
    },
  });

  const totalPrice = calculateTotalPrice();
  const duration =
    formik.values.startDate && formik.values.endDate
      ? (() => {
          try {
            const startISO = parseDDMMYYYYToISO(formik.values.startDate);
            const endISO = parseDDMMYYYYToISO(formik.values.endDate);
            return calculateBookingDuration(startISO, endISO);
          } catch {
            return 0;
          }
        })()
      : 0;

  const areDatesValid = formik.values.startDate && formik.values.endDate;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <PersonalInfoCheckout
          isDataConfirmed={isDataConfirmed}
          setIsDataConfirmed={setIsDataConfirmed}
        />

        <BookingDates
          formik={formik}
          duration={duration}
          totalPrice={totalPrice}
        />

        <DarkButton
          text={isSubmitting ? "Procesando..." : "Crear reserva y pagar"}
          onClick={() => formik.handleSubmit()}
          type="button"
          disabled={isSubmitting || !areDatesValid || !isDataConfirmed}
          className="w-full"
        />

        {!isDataConfirmed && areDatesValid && (
          <p className="text-sm text-custume-red text-center">
            Por favor confirma que los datos son correctos
          </p>
        )}
      </form>
    </div>
  );
}
