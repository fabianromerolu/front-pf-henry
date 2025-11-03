import VehicleProps from "@/interfaces/vehicleProps";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app";

interface PaginatedResponse {
  data: VehicleProps[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export const getAllVehicles = async (): Promise<VehicleProps[]> => {
  try {
    const res = await fetch(`${API_URL}/pins/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response: PaginatedResponse = await res.json();

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw new Error(
      `Error to get vehicles: ${
        error instanceof Error ? error.message : "Error not found"
      }`
    );
  }
};

export const getVehicleById = async (
  idByParam: string
): Promise<VehicleProps> => {
  try {
    const allVahicles = await getAllVehicles();

    const vehicle = allVahicles.find(
      (vehicle) => vehicle.id.toString() === idByParam
    );

    if (!vehicle) {
      throw new Error(`Producto con ID ${idByParam} no encontrado`);
    }
    return vehicle;
  } catch (error) {
    throw error;
  }
};

export const updateVehicle = async (
  id: string,
  vehicleData: Partial<VehicleProps>,
  token?: string
): Promise<VehicleProps> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/pins/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(vehicleData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const updatedVehicle: VehicleProps = await res.json();

    return updatedVehicle;
  } catch (error) {
    throw new Error(
      `Error to update vehicle: ${
        error instanceof Error ? error.message : "Error not found"
      }`
    );
  }
};

export const deleteVehicle = async (
  id: string,
  token?: string
): Promise<void> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/pins/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    if (res.status !== 204) {
      await res.json();
    }
  } catch (error) {
    throw new Error(
      `Error to delete vehicle: ${
        error instanceof Error ? error.message : "Error no encontrado"
      }`
    );
  }
};
