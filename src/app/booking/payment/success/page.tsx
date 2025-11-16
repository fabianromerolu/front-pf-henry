// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import {
//   handlePaymentSuccess,
//   getPaymentParamsFromURL,
// } from "@/services/paymentsService.service";

// function PaymentSuccessContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [status, setStatus] = useState<"loading" | "success" | "error">(
//     "loading"
//   );
//   const [bookingId, setBookingId] = useState<string | null>(null);

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         const params = getPaymentParamsFromURL(searchParams);
//         const result = await handlePaymentSuccess(
//           params.paymentId,
//           params.preferenceId
//         );

//         setBookingId(result.bookingId || null);
//         setStatus("success");

//         setTimeout(() => {
//           router.push("/bookings");
//         }, 3000);
//       } catch (error) {
//         console.error("Error al verificar el pago:", error);
//         setStatus("error");
//       }
//     };

//     verifyPayment();
//   }, [searchParams, router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
//         {status === "loading" && (
//           <>
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
//             <h2 className="text-xl font-semibold mb-2">
//               Confirmando tu pago...
//             </h2>
//             <p className="text-gray-600">Por favor espera un momento</p>
//           </>
//         )}

//         {status === "success" && (
//           <>
//             <div className="text-green-500 text-6xl mb-4">✓</div>
//             <h2 className="text-2xl font-bold mb-2 text-green-600">
//               ¡Pago exitoso!
//             </h2>
//             <p className="text-gray-700 mb-4">Tu reserva ha sido confirmada</p>
//             {bookingId && (
//               <p className="text-sm text-gray-500 mb-2">
//                 ID de reserva: <strong>{bookingId}</strong>
//               </p>
//             )}
//             <p className="text-sm text-gray-500 mt-4">
//               Redirigiendo a tus reservas...
//             </p>
//           </>
//         )}

//         {status === "error" && (
//           <>
//             <div className="text-red-500 text-6xl mb-4">✗</div>
//             <h2 className="text-2xl font-bold mb-2 text-red-600">
//               Error al confirmar
//             </h2>
//             <p className="text-gray-700 mb-4">
//               Hubo un problema al verificar tu pago. Por favor, contacta a
//               soporte.
//             </p>
//             <button
//               onClick={() => router.push("/")}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
//             >
//               Volver al inicio
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function PaymentSuccessPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
//         </div>
//       }
//     >
//       <PaymentSuccessContent />
//     </Suspense>
//   );
// }
