// components/BookingForm.tsx

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
import { BookingValidationSchema } from "@/validators/BookingSchema";
import { CreatePaymentRequest } from "@/services/paymentsService.service";
import "react-datepicker/dist/react-datepicker.css";
import BookingDates from "./BookingDates";
import PersonalInfoCheckout from "./PersonalInfoCheckout";
import PaymentButton from "../Buttoms/paymentButton";

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
  const [bookingData, setBookingData] = useState<CreatePaymentRequest | null>(
    null
  );

  const calculateTotalPrice = () => {
    if (!formik.values.startDate || !formik.values.endDate) return 0;

    try {
      const days = calculateBookingDuration(
        formik.values.startDate,
        formik.values.endDate
      );
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
    onSubmit: async () => {
      // Esta función ya no se usa, la lógica está en handleCreateBooking
    },
  });

  // Función para crear la reserva (se llama desde PaymentButton)
  const handleCreateBooking = async () => {
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

    try {
      const calculatedTotal = calculateTotalPrice();
      if (calculatedTotal < 1000) {
        alert(
          `El monto de la reserva (${calculatedTotal}) es muy bajo para procesarse por Mercado Pago. El mínimo es $1,000 COP.\n\nPor favor, extiende las fechas de tu reserva.`
        );
        return;
      }

      console.log("📤 Enviando reserva con fechas ISO:", {
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
      });

      const response = await createBooking(
        {
          userId,
          pinId: vehicleId,
          start_date: formik.values.startDate,
          end_date: formik.values.endDate,
        },
        token
      );

      const responseAny = response as any;

      // Extrae el ID de la reserva
      let extractedId = null;
      if (response?.id) extractedId = response.id;
      else if (responseAny?._id) extractedId = responseAny._id;
      else if (responseAny?.data?.id) extractedId = responseAny.data.id;
      else if (responseAny?.booking?.id) extractedId = responseAny.booking.id;
      else if (typeof responseAny === "string") extractedId = responseAny;

      if (!extractedId) {
        throw new Error("No se pudo obtener el ID de la reserva del servidor");
      }

      console.log("✅ Reserva creada con ID:", extractedId);

      // Prepara los datos para el pago
      const paymentData: CreatePaymentRequest = {
        bookingId: extractedId,
        propertyId: vehicleId,
        userId: userId,
        checkIn: formik.values.startDate,
        checkOut: formik.values.endDate,
        guests: 1, // Ajusta según tu lógica
        totalPrice: calculatedTotal,
      };

      setBookingData(paymentData);

      // El PaymentButton automáticamente procesará el pago
      // cuando bookingData cambie de null a un objeto
    } catch (error) {
      console.error("💥 Error al crear reserva:", error);
      alert(
        error instanceof Error ? error.message : "Error al procesar la reserva"
      );
    }
  };

  const totalPrice = calculateTotalPrice();

  const duration =
    formik.values.startDate && formik.values.endDate
      ? (() => {
          try {
            return calculateBookingDuration(
              formik.values.startDate,
              formik.values.endDate
            );
          } catch {
            return 0;
          }
        })()
      : 0;

  const areDatesValid = formik.values.startDate && formik.values.endDate;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <PersonalInfoCheckout
          isDataConfirmed={isDataConfirmed}
          setIsDataConfirmed={setIsDataConfirmed}
        />

        <BookingDates
          formik={formik}
          duration={duration}
          totalPrice={totalPrice}
        />

        {/* Resumen de reserva si ya fue creada */}
        {bookingData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              ✅ Reserva creada exitosamente
            </h3>
            <p className="text-sm text-green-700">
              ID: {bookingData.bookingId}
            </p>
            <p className="text-sm text-green-700 mt-2">
              Haz clic en el botón para proceder al pago
            </p>
          </div>
        )}

        <PaymentButton
          bookingData={bookingData}
          isDataConfirmed={isDataConfirmed}
          onCreateBooking={handleCreateBooking}
          disabled={!areDatesValid}
          className="w-full"
        />

        {!isDataConfirmed && areDatesValid && (
          <p className="text-sm text-custume-red text-center">
            Por favor confirma que los datos son correctos
          </p>
        )}
      </div>
    </div>
  );
}
