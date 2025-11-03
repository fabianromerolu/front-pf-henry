"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import VehicleProps from "@/interfaces/vehicleProps";
import {
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "@/services/vehicleService.service";

interface VehicleContextType {
  vehicles: VehicleProps[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  getVehicle: (id: string) => Promise<VehicleProps | undefined>;
  updateVehicleData: (
    id: string,
    data: Partial<VehicleProps>,
    token?: string
  ) => Promise<void>;
  deleteVehicleData: (id: string, token?: string) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const getVehicle = async (id: string): Promise<VehicleProps | undefined> => {
    try {
      const vehicle = await getVehicleById(id);
      return vehicle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return undefined;
    }
  };

  const updateVehicleData = async (
    id: string,
    data: Partial<VehicleProps>,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedVehicle = await updateVehicle(id, data, token);
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id.toString() === id ? updatedVehicle : vehicle
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicleData = async (id: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVehicle(id, token);
      setVehicles((prev) =>
        prev.filter((vehicle) => vehicle.id.toString() !== id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        error,
        fetchVehicles,
        getVehicle,
        updateVehicleData,
        deleteVehicleData,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error("useVehicles must be used within a VehicleProvider");
  }
  return context;
};
