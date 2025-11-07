"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  fetchVehicles: (pageNum?: number) => Promise<void>;
  getVehicle: (id: string) => Promise<VehicleProps | undefined>;
  updateVehicleData: (
    id: string,
    data: Partial<VehicleProps>,
    token?: string
  ) => Promise<void>;
  deleteVehicleData: (id: string, token?: string) => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNum: number) => void;
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

  const fetchVehicles = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllVehicles({ page: pageNum, limit });
        setVehicles(Array.isArray(response.data) ? response.data : []);
        setPage(response.page);
        setTotal(response.total);
        setHasNextPage(response.hasNextPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      const newPage = page + 1;
      fetchVehicles(newPage);
    }
  }, [hasNextPage, page, fetchVehicles]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      const newPage = page - 1;
      fetchVehicles(newPage);
    }
  }, [page, fetchVehicles]);

  const goToPage = useCallback(
    (pageNum: number) => {
      fetchVehicles(pageNum);
    },
    [fetchVehicles]
  );

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
  }, [fetchVehicles]);

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
        fetchVehicles,
        getVehicle,
        updateVehicleData,
        deleteVehicleData,
        nextPage,
        prevPage,
        goToPage,
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
