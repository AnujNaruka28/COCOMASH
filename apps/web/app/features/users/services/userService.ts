import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosAPIService } from "@/lib/APIService";
import { toast } from "sonner";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  meta: {
    timestamp: string;
    path: string;
    method: string;
  };
}

interface UserData {
  id: string;
  name: string;
  email: string | null;
  profile_url: string | null;
}

const createOrGetUser = async (name: string): Promise<UserData> => {
  const axiosResponse = await AxiosAPIService('/users/', 'POST', { name });
  const response = axiosResponse.data as ApiResponse<UserData>;
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to create user');
  }
  
  return response.data;
};

const getUserById = async (userId: string): Promise<UserData> => {
  const axiosResponse = await AxiosAPIService(`/users/${userId}`, 'GET');
  const response = axiosResponse.data as ApiResponse<UserData>;
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to get user');
  }
  
  return response.data;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (name: string) => createOrGetUser(name),
    onSuccess: (userData) => {
      toast.success("User created successfully");
      return userData;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    }
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const userService = {
  createOrGetUser,
  getUserById
};
