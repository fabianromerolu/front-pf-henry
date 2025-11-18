// components/BookingDates.tsx

import React from "react";
import DatePicker from "react-datepicker";
import { FormikProps } from "formik";
import "react-datepicker/dist/react-datepicker.css";

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
  // Convierte string ISO a Date object para el DatePicker
  const startDateValue = formik.values.startDate
    ? new Date(formik.values.startDate)
    : null;

  const endDateValue = formik.values.endDate
    ? new Date(formik.values.endDate)
    : null;

  // Handler para fecha de inicio
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      // Convierte a ISO string y actualiza Formik
      const isoString = date.toISOString();
      formik.setFieldValue("startDate", isoString);
    } else {
      formik.setFieldValue("startDate", "");
    }
  };

  // Handler para fecha de término
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const isoString = date.toISOString();
      formik.setFieldValue("endDate", isoString);
    } else {
      formik.setFieldValue("endDate", "");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-custume-blue/20 p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-custume-blue mb-4">
        Reserva tu vehículo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-custume-blue text-sm font-medium mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custume-blue"
            showTimeSelect={false}
          />

          {formik.touched.startDate && formik.errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.startDate as string}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Selecciona la fecha de inicio de tu reserva
          </p>
        </div>

        <div>
          <label className="block text-custume-blue text-sm font-medium mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custume-blue"
            showTimeSelect={false}
            disabled={!startDateValue}
          />

          {formik.touched.endDate && formik.errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.endDate as string}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Selecciona la fecha de término de tu reserva
          </p>
        </div>
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
  );
}

export default BookingDates;
