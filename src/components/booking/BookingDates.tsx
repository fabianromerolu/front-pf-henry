import React from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FormikProps } from "formik";

interface BookingFormValues {
  startDate: string;
  endDate: string;
  cartNumber: string;
  expirationDate: string;
  cvv: string;
}

interface BookingDatesProps {
  formik: FormikProps<BookingFormValues>;
  duration: number;
  totalPrice: number;
}

function BookingDates({ formik, duration, totalPrice }: BookingDatesProps) {
  return (
    <div className="bg-white rounded-2xl border border-custume-gray p-6 shadow-lg">
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
              {formik.errors.startDate as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-custume-blue text-sm font-medium mb-2">
            Fecha de término
          </label>
          <DatePicker
            selected={
              formik.values.endDate
                ? (() => {
                    const [day, month, year] = formik.values.endDate.split("/");
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
            minDate={
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
                : new Date()
            }
            className="w-full px-4 py-3 border border-custume-blue rounded-xl focus:outline-none focus:border-custume-blue focus:ring-2 focus:ring-custume-blue/20"
            wrapperClassName="w-full"
            showPopperArrow={false}
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.endDate as string}
            </p>
          )}
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
