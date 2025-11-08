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
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
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

  // Estados de paginación
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Calcular si hay página siguiente
  const hasNextPage = page * limit < total;

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicles();
      const vehiclesArray = Array.isArray(data) ? data : [];
      setVehicles(vehiclesArray);
      setTotal(vehiclesArray.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setVehicles([]);
      setTotal(0);
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
      setTotal((prev) => prev - 1);

      // Si eliminamos el último vehículo de la página actual, volver a la anterior
      const totalPages = Math.ceil((total - 1) / limit);
      if (page > totalPages && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funciones de paginación
  const nextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToPage = (newPage: number) => {
    const totalPages = Math.ceil(total / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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
        page,
        limit,
        total,
        hasNextPage,
        nextPage,
        prevPage,
        goToPage,
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
