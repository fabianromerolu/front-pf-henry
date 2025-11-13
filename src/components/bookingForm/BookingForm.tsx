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
import DarkButton from "../Buttoms/DarkButtom";
import LightButton from "../Buttoms/LightButtom";
import { BookingValidationSchema } from "@/validators/BookingSchema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { validateBookingDates } from "@/helpers/booking.helper";
import { format } from "date-fns";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const handleRentNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/home}`);
  };

  const handleBackVehicles = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/vehicles`);
  };

  const parseDDMMYYYYToISO = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toISOString();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19);
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + "/" + cleaned.substr(2, 2);
    }
    return cleaned;
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
      cartNumber: "",
      expirationDate: "",
      cvv: "",
    },
    validationSchema: BookingValidationSchema,
    onSubmit: async (values) => {
      const token = AuthUser?.token;
      const userId = AuthUser?.user?.id;

      if (!token || !userId) {
        alert("Debes iniciar sesión para hacer una reserva");
        return;
      }

      try {
        const startISO = parseDDMMYYYYToISO(values.startDate);
        const endISO = parseDDMMYYYYToISO(values.endDate);

        const validation = validateBookingDates(startISO, endISO);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        const booking = await createBooking(
          {
            userId,
            pinId: vehicleId,
            start_date: startISO,
            end_date: endISO,
          },
          token
        );

        setBookingDetails(booking);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/my-bookings");
        }, 3000);
      } catch (error) {
        console.error("Error al crear reserva:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Error al procesar la reserva"
        );
      }
    },
  });

  // if (!AuthUser?.user) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-custume-blue text-xl">
  //         Debes iniciar sesión para hacer una reserva
  //       </div>
  //     </div>
  //   );
  // }

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-custume-blue p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-custume-blue mb-4">
            Reserva tu vehículo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-custume-blue text-sm font-medium mb-2">
                Fecha de inicio
              </label>
              <DatePicker
                selected={
                  formik.values.startDate
                    ? (() => {
                        const [day, month, year] =
                          formik.values.startDate.split("/");
                        return new Date(
                          Number(year),
                          Number(month) - 1,
                          Number(day)
                        );
                      })()
                    : null
                }
                onChange={(date: Date | null) => {
                  if (date) {
                    const formatted = format(date, "dd/MM/yyyy");
                    formik.setFieldValue("startDate", formatted);
                  } else {
                    formik.setFieldValue("startDate", "");
                  }
                }}
                onBlur={() => formik.setFieldTouched("startDate", true)}
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/AAAA"
                locale={es}
                minDate={new Date()}
                className="w-full px-4 py-3 border border-custume-blue rounded-xl focus:outline-none focus:border-custume-blue focus:ring-2 focus:ring-custume-blue/20"
                wrapperClassName="w-full"
                showPopperArrow={false}
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-custume-blue text-sm font-medium mb-2">
                Fecha de termino
              </label>
              <DatePicker
                selected={
                  formik.values.endDate
                    ? (() => {
                        const [day, month, year] =
                          formik.values.endDate.split("/");
                        return new Date(
                          Number(year),
                          Number(month) - 1,
                          Number(day)
                        );
                      })()
                    : null
                }
                onChange={(date: Date | null) => {
                  if (date) {
                    // Formatear a DD/MM/AAAA
                    const formatted = format(date, "dd/MM/yyyy");
                    formik.setFieldValue("endDate", formatted);
                  } else {
                    formik.setFieldValue("endDate", "");
                  }
                }}
                onBlur={() => formik.setFieldTouched("endDate", true)}
                name="endDate"
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/AAAA"
                locale={es}
                minDate={new Date()}
                className="w-full px-4 py-3 border border-custume-blue rounded-xl focus:outline-none focus:border-custume-blue focus:ring-2 focus:ring-custume-blue/20"
                wrapperClassName="w-full"
                showPopperArrow={false}
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.endDate}
                </p>
              )}
            </div>{" "}
          </div>

          {duration > 0 && (
            <div className="bg-custume-light p-4 rounded-lg">
              <div className="flex justify-between text-custume-blue mb-2">
                <span>Duración:</span>
                <span className="font-semibold">
                  {duration} {duration === 1 ? "día" : "días"}
                </span>
              </div>
              <div className="flex justify-between text-custume-blue text-lg font-bold">
                <span>Total:</span>
                <span className="text-custume-red">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-custume-blue/20 p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDataConfirmed}
              onChange={(e) => setIsDataConfirmed(e.target.checked)}
              className="w-5 h-5 text-custume-blue focus:ring-custume-blue"
            />
            <span className="text-custume-blue">
              Confirmo que los datos son correctos
            </span>
          </label>
        </div>

        {isDataConfirmed && (
          <div className="bg-white rounded-2xl border border-custume-blue/20 p-6">
            <h3 className="text-lg font-semibold text-custume-blue mb-4">
              Datos de pago
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-custume-blue text-sm font-medium mb-2">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  name="cartNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={formatCardNumber(formik.values.cartNumber)}
                  onChange={(e) => {
                    const formatted = e.target.value.replace(/\s/g, "");
                    formik.setFieldValue("cartNumber", formatted);
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-custume-blue/30 rounded-xl focus:outline-none focus:border-custume-blue focus:ring-2 focus:ring-custume-blue/20"
                />
                {formik.touched.cartNumber && formik.errors.cartNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.cartNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-custume-blue text-sm font-medium mb-2">
                    Expiración
                  </label>
                  <input
                    type="text"
                    name="expirationDate"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={formatExpirationDate(formik.values.expirationDate)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      formik.setFieldValue(
                        "expirationDate",
                        formatExpirationDate(cleaned)
                      );
                    }}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 border border-custume-blue/30 rounded-xl focus:outline-none focus:border-custume-blue focus:ring-2 focus:ring-custume-blue/20"
                  />
                  {formik.touched.expirationDate &&
                    formik.errors.expirationDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.expirationDate}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-custume-blue text-sm font-medium mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    maxLength={4}
                    value={formik.values.cvv}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      formik.setFieldValue("cvv", cleaned);
                    }}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 border border-custume-blue/30 rounded-xl focus:outline-none focus:border-custume-blue focus:ring-2 focus:ring-custume-blue/20"
                  />
                  {formik.touched.cvv && formik.errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-4 mt-8">
          <DarkButton
            className="w-full py-4 rounded-full text-xl lowercase"
            text="rentar ahora"
            onClick={handleRentNow}
          />
          <LightButton
            className="w-full py-4 rounded-full text-xl lowercase"
            text="volver a vehículos"
            onClick={handleBackVehicles}
          />
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-custume-blue mb-2">
              ¡Reserva Confirmada!
            </h3>
            <p className="text-custume-gray mb-4">
              Tu reserva ha sido procesada exitosamente
            </p>
            <p className="text-sm text-custume-blue">
              Redirigiendo a tus reservas...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
