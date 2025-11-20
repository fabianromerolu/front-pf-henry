// components/BookingDates.tsx
"use client";

import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { FormikProps } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface BookingFormValues {
  startDate: string; // ISO format
  endDate: string; // ISO format
}

interface BookingDatesProps {
  formik: FormikProps<BookingFormValues>;
  duration: number;
  totalPrice: number;
}

function BookingDates({ formik, duration, totalPrice }: BookingDatesProps) {
  const MINIMUM_TOTAL = 1000;

  // Referencias para evitar toasts duplicados
  const lastStartDateError = useRef<string | null>(null);
  const lastEndDateError = useRef<string | null>(null);

  // Convierte string ISO a Date object para el DatePicker
  const startDateValue = formik.values.startDate
    ? new Date(formik.values.startDate)
    : null;

  const endDateValue = formik.values.endDate
    ? new Date(formik.values.endDate)
    : null;

  // Mostrar toast cuando hay error en startDate (evita duplicados)
  useEffect(() => {
    if (formik.touched.startDate && formik.errors.startDate) {
      // Solo mostrar si el error es diferente al anterior
      if (lastStartDateError.current !== formik.errors.startDate) {
        toast.error(formik.errors.startDate);
        lastStartDateError.current = formik.errors.startDate;
      }
    } else {
      lastStartDateError.current = null;
    }
  }, [formik.touched.startDate, formik.errors.startDate]);

  // Mostrar toast cuando hay error en endDate (evita duplicados)
  useEffect(() => {
    if (formik.touched.endDate && formik.errors.endDate) {
      // Solo mostrar si el error es diferente al anterior
      if (lastEndDateError.current !== formik.errors.endDate) {
        toast.error(formik.errors.endDate);
        lastEndDateError.current = formik.errors.endDate;
      }
    } else {
      lastEndDateError.current = null;
    }
  }, [formik.touched.endDate, formik.errors.endDate]);

  // Handler para fecha de inicio
  const handleStartDateChange = async (date: Date | null) => {
    if (date) {
      const isoString = date.toISOString();
      await formik.setFieldValue("startDate", isoString);
      await formik.setFieldTouched("startDate", true, false);

      // Validar después de cambiar
      const errors = await formik.validateForm();
      if (errors.startDate) {
        // El useEffect manejará el toast
      }
    } else {
      formik.setFieldValue("startDate", "");
    }
  };

  // Handler para fecha de término
  const handleEndDateChange = async (date: Date | null) => {
    if (date) {
      const isoString = date.toISOString();
      await formik.setFieldValue("endDate", isoString);
      await formik.setFieldTouched("endDate", true, false);

      // Validar después de cambiar
      const errors = await formik.validateForm();
      if (errors.endDate) {
        // El useEffect manejará el toast
      }
    } else {
      formik.setFieldValue("endDate", "");
    }
  };

  const isMinimumMet = totalPrice >= MINIMUM_TOTAL;

  return (
    <div className="bg-white rounded-2xl border border-custume-blue/20 p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-custume-blue taviraj mb-4 lowercase">
        reserva tu vehículo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-custume-blue text-sm font-medium mb-2 montserrat">
            Fecha de inicio
          </label>

          <DatePicker
            selected={startDateValue}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDateValue}
            endDate={endDateValue}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de inicio"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors montserrat
              ${
                formik.touched.startDate && formik.errors.startDate
                  ? "border-custume-red focus:ring-custume-red"
                  : "border-gray-300 focus:ring-custume-blue"
              }`}
            showTimeSelect={false}
          />

          {formik.touched.startDate && formik.errors.startDate && (
            <p className="text-custume-red text-xs mt-1 montserrat">
              {formik.errors.startDate as string}
            </p>
          )}
          <p className="text-xs text-custume-gray mt-1 montserrat">
            Selecciona la fecha de inicio de tu reserva
          </p>
        </div>

        <div>
          <label className="block text-custume-blue text-sm font-medium mb-2 montserrat">
            Fecha de término
          </label>

          <DatePicker
            selected={endDateValue}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDateValue}
            endDate={endDateValue}
            minDate={startDateValue || new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de término"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors montserrat
              ${
                formik.touched.endDate && formik.errors.endDate
                  ? "border-custume-red focus:ring-custume-red"
                  : "border-gray-300 focus:ring-custume-blue"
              }`}
            showTimeSelect={false}
            disabled={!startDateValue}
          />

          {formik.touched.endDate && formik.errors.endDate && (
            <p className="text-custume-red text-xs mt-1 montserrat">
              {formik.errors.endDate as string}
            </p>
          )}
          <p className="text-xs text-custume-gray mt-1 montserrat">
            Selecciona la fecha de término de tu reserva
          </p>
        </div>
      </div>

      {duration > 0 && (
        <div
          className={`p-4 rounded-lg border-2 transition-colors ${
            isMinimumMet
              ? "bg-light-blue/20 border-custume-blue"
              : "bg-red-50 border-custume-red"
          }`}
        >
          <div className="flex justify-between text-custume-blue mb-2 montserrat">
            <span>Duración:</span>
            <span className="font-semibold">
              {duration} {duration === 1 ? "día" : "días"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-custume-blue montserrat font-bold text-lg">
              Total:
            </span>
            <span
              className={`text-2xl font-bold taviraj ${
                isMinimumMet ? "text-custume-blue" : "text-custume-red"
              }`}
            >
              ${totalPrice.toLocaleString()}
            </span>
          </div>

          {!isMinimumMet && totalPrice > 0 && (
            <div className="mt-3 pt-3 border-t border-custume-red/20">
              <p className="text-sm text-custume-red montserrat flex items-center gap-2">
                <span>💰</span>
                <span>
                  El monto mínimo de reserva es $
                  {MINIMUM_TOTAL.toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingDates;
