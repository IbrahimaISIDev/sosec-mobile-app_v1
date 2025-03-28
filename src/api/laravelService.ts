import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";
import { Mileage } from "../types/mileage.types";
import { Expense } from "../types/expense.types";

// Remplacez par votre domaine réel après déploiement
const BASE_URL = "https://api.sosec.com/api";

// Fonction pour créer une instance Axios avec un token dynamique
const createLaravelApi = (token: string) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

const cloudinary = new Cloudinary({
  cloud: { cloudName: "YOUR_CLOUD_NAME" }, // Remplacez par votre nom de cloud Cloudinary
  url: { secure: true },
});

export const getCloudinarySignature = async (token: string) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get("/cloudinary/signature");
  return response.data;
};

export const uploadToCloudinary = async (
  imageUri: string,
  signatureData: any
) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);
  formData.append("api_key", signatureData.api_key);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const result = await response.json();
  return result.secure_url;
};

export const extractTicket = async (
  token: string,
  imageUri: string,
  metadata: { truck_id: string; user_id: string }
) => {
  const laravelApi = createLaravelApi(token);
  const signatureData = await getCloudinarySignature(token);
  const imageUrl = await uploadToCloudinary(imageUri, signatureData);
  const response = await laravelApi.post("/tickets/extract", {
    image_url: imageUrl,
    ...metadata,
  });
  return response.data;
};

export const getTicket = async (token: string, id: string) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get(`/tickets/${id}`);
  return response.data;
};

export const extractMileage = async (
  token: string,
  imageUri: string,
  metadata: { truck_id: string; user_id: string }
): Promise<{ success: boolean; data?: Mileage }> => {
  const laravelApi = createLaravelApi(token);
  const signatureData = await getCloudinarySignature(token);
  const imageUrl = await uploadToCloudinary(imageUri, signatureData);
  const response = await laravelApi.post<{ success: boolean; data?: Mileage }>(
    "/mileage/extract",
    {
      image_url: imageUrl,
      ...metadata,
    }
  );
  return response.data;
};

export const getMileage = async (token: string, id: string) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get(`/mileage/${id}`);
  return response.data;
};

export const storeExpense = async (
  token: string,
  data: { truck_id: string; user_id: string; type: string; amount: number },
  imageUri?: string
): Promise<{ success: boolean; data?: Expense }> => {
  const laravelApi = createLaravelApi(token);
  let imageUrl = null;
  if (imageUri) {
    const signatureData = await getCloudinarySignature(token);
    imageUrl = await uploadToCloudinary(imageUri, signatureData);
  }
  const response = await laravelApi.post<{ success: boolean; data?: Expense }>(
    "/expenses/store",
    {
      ...data,
      image_url: imageUrl,
    }
  );
  return response.data;
};

export const getExpense = async (token: string, id: string) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get(`/expenses/${id}`);
  return response.data;
};

export const getHistory = async (
  token: string,
  truckId: string,
  userId?: string
) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get("/history/list", {
    params: { truck_id: truckId, user_id: userId },
  });
  return response.data;
};

export const updateProfile = async (
  token: string,
  data: { display_name?: string; phone_number?: string }
) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.put("/profile/update", data);
  return response.data;
};

export const getProfile = async (token: string) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get("/profile");
  return response.data;
};

export const updateTruck = async (
  token: string,
  truckId: string,
  data: { current_km?: number; status?: string }
) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.put("/trucks/update", {
    truck_id: truckId,
    ...data,
  });
  return response.data;
};

export const getTruck = async (token: string, id: string) => {
  const laravelApi = createLaravelApi(token);
  const response = await laravelApi.get(`/trucks/${id}`);
  return response.data;
};


export const getUsers = async (token: string) => {
    const laravelApi = createLaravelApi(token);
    const response = await laravelApi.get("/users");
    return response.data;
}

export const updateUser = async (token: string, userId: string, data: { display_name?: string; role?: string }) => {
    const laravelApi = createLaravelApi(token);
    const response = await laravelApi.put(`/users/update`, {
        user_id: userId,
       ...data,
    });
    return response.data;
}

export const deleteUser = async (token: string, userId: string) => {
    const laravelApi = createLaravelApi(token);
    const response = await laravelApi.delete(`/users/delete/${userId}`);
    return response.data;
}

export const getFuelTypes = async (token: string) => {
    const laravelApi = createLaravelApi(token);
    const response = await laravelApi.get("/fuel-types");
    return response.data;
}

export const updateFuelType = async (token: string, fuelTypeId: string, data: { name?: string; price?: number }) => {
    const laravelApi = createLaravelApi(token);
    const response = await laravelApi.put(`/fuel-types/update`, {
        fuel_type_id: fuelTypeId,
       ...data,
    });
    return response.data;
}

export const deleteFuelType = async (token: string, fuelTypeId: string) => {
    const laravelApi = createLaravelApi(token);
    const response = await laravelApi.delete(`/fuel-types/delete/${fuelTypeId}`);
    return response.data;
}