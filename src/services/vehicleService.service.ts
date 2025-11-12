import VehicleProps from "@/interfaces/vehicleProps";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app"
).replace(/\/+$/, "");

export interface PaginatedResponse {
  data: VehicleProps[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export interface GetVehiclesParams {
  page?: number;
  limit?: number;
  brand?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export interface PinStatus {
  status: "published" | "paused" | "blocked";
}

export interface SeederResponse {
  message: string;
  created: number;
}

export const getAllVehicles = async (
  params?: GetVehiclesParams
): Promise<PaginatedResponse> => {
  try {
    const { page = 1, limit = 12 } = params || {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(
      `${API_URL}/pins/public?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response: PaginatedResponse = await res.json();

    return response;
  } catch (error) {
    throw new Error(
      `Error to get vehicles: ${
        error instanceof Error ? error.message : "Error not found"
      }`
    );
  }
};

export const getAllVehiclesArray = async (): Promise<VehicleProps[]> => {
  try {
    const response = await getAllVehicles();
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

export const getVehicleById = async (id: string): Promise<VehicleProps> => {
  try {
    const res = await fetch(`${API_URL}/pins/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Vehículo con ID ${id} no encontrado`);
      }
      if (res.status === 400) {
        throw new Error(`ID inválido: ${id}`);
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const vehicle: VehicleProps = await res.json();
    return vehicle;
  } catch (error) {
    throw new Error(
      `Error al obtener el vehículo: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
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

export const getMyPins = async (
  token: string,
  params?: GetVehiclesParams
): Promise<PaginatedResponse> => {
  try {
    const { page = 1, limit = 12 } = params || {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(
      `${API_URL}/pins/mine/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("No autorizado. Por favor inicia sesión.");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response: PaginatedResponse = await res.json();
    return response;
  } catch (error) {
    throw new Error(
      `Error al obtener tus pins: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const createPin = async (
  pinData: Partial<VehicleProps>,
  token: string
): Promise<VehicleProps> => {
  try {
    const res = await fetch(`${API_URL}/pins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pinData),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("No autorizado. Por favor inicia sesión.");
      }
      if (res.status === 403) {
        throw new Error("No tienes permisos para crear pins.");
      }
      if (res.status === 400) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Datos inválidos");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const createdPin: VehicleProps = await res.json();
    return createdPin;
  } catch (error) {
    throw new Error(
      `Error al crear el pin: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const changePinStatus = async (
  id: string,
  status: "published" | "paused" | "blocked",
  token: string
): Promise<VehicleProps> => {
  try {
    const res = await fetch(`${API_URL}/pins/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("No autorizado. Por favor inicia sesión.");
      }
      if (res.status === 403) {
        throw new Error(
          "No tienes permisos para cambiar el estado de este pin."
        );
      }
      if (res.status === 404) {
        throw new Error(`Pin con ID ${id} no encontrado`);
      }
      if (res.status === 400) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Estado inválido");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const updatedPin: VehicleProps = await res.json();
    return updatedPin;
  } catch (error) {
    throw new Error(
      `Error al cambiar el estado del pin: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const runPinSeeder = async (token?: string): Promise<SeederResponse> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/pins/seeder`, {
      method: "POST",
      headers,
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error(
          "Esta funcionalidad solo está disponible en modo DEMO."
        );
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response: SeederResponse = await res.json();
    return response;
  } catch (error) {
    throw new Error(
      `Error al ejecutar el seeder: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};
