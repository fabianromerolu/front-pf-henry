import { useAuth } from "@/context/AuthContext";
import React from "react";

interface PersonalInfoCheckoutProps {
  isDataConfirmed: boolean;
  setIsDataConfirmed: (value: boolean) => void;
}

function PersonalInfoCheckout({
  isDataConfirmed,
  setIsDataConfirmed,
}: PersonalInfoCheckoutProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-custume-blue/20 p-6">
      {user && (
        <div>
          <p className="text-2xl text-custume-gray">
            <span className="font-semibold text-custume-blue">Nombre:</span>{" "}
            {user.name}
          </p>
          <p className="text-2xl text-custume-gray mt-1">
            <span className="font-semibold text-custume-blue">Correo:</span>{" "}
            {user.email}
          </p>
        </div>
      )}

      <label className="flex items-center gap-3 cursor-pointer mt-2">
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
  );
}

export default PersonalInfoCheckout;
