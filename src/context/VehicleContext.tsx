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

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllVehicles({ page, limit });

      setVehicles(response.data);
      setTotal(response.total);
      setHasNextPage(response.hasNextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setVehicles([]);
      setTotal(0);
      setHasNextPage(false);
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

      await fetchVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
  }, [page]);

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
