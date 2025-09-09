import axios, { AxiosError } from "axios"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface ApiError {
    message: string;
    status?: number;
}

export async function getAllProfiles() {
    try {
        const response = await axios.get(`${API_BASE_URL}/profiles`, {
            withCredentials: true
        });
        
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch profiles',
                status: error.response?.status,
            };
            
            return {
                success: false,
                error: apiError,
            };
        }
        
        return {
            success: false,
            error: { message: 'An unexpected error occurred while fetching profiles' },
        };
    }
}

export async function getCurrentProfile() {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            withCredentials: true
        });
        
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch profile',
                status: error.response?.status,
            };
            
            return {
                success: false,
                error: apiError,
            };
        }
        
        return {
            success: false,
            error: { message: 'An unexpected error occurred while fetching profile' },
        };
    }
}