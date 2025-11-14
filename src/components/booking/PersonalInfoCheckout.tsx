import React, { useState } from "react";

function PersonalInfoCheckout() {
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);

  return (
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
  );
}

export default PersonalInfoCheckout;
