import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api'

// Enhanced error handling interface
interface ApiError {
    message: string;
    status?: number;
}

export async function checkAuthStatus() {
    try{
        const response = await axios.get(`${API_BASE_URL}/me`,{withCredentials:true})
        return {
            success:true,
            data:response.data,
        }
    }catch(error){
        return {
            success:false,
            error:{message:"Not authenticated"}
        }
    }
}

export async function loginUser(credentials: { email: string; password: string }) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials,{withCredentials:true});
        
        // Return the actual data
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        // Proper error handling
        if (error instanceof AxiosError) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Login failed',
                status: error.response?.status,
            };
            
            // Handle specific error cases
            if (error.code === 'ERR_NETWORK') {
                apiError.message = 'Network error. Please check your internet connection.';
            } else if (error.response?.status === 401) {
                apiError.message = 'Invalid email or password.';
            } else if (error.response?.status === 429) {
                apiError.message = 'Too many login attempts. Please try again later.';
            }
            
            return {
                success: false,
                error: apiError,
            };
        }
        
        return {
            success: false,
            error: { message: 'An unexpected error occurred' },
        };
    }
}

export async function registerUser(credentials:{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    universityName:string,
    gender:string,
    yearJoined:string,
    department:string
}) {
    
    try{
        
        const response = await axios.post(`${API_BASE_URL}/signup`,credentials,{withCredentials:true})

        return {
            success:true,
            data:response.data,
        }
    }catch(error){
        if(error instanceof AxiosError)
                return{
                    success:false,
                    error:{
                        message:error.response?.data?.message ||"Registration Failed",
                        status:error.response?.status
                    }
                }
        return {
            success:false,
            error:{message:"An unexpected Error occured during registration"}
        }
    }
}

export async function logoutUser(){

    try{
        const response = await axios.post(`${API_BASE_URL}/logout`,{},{withCredentials:true});

        return {
            success:true,
            data:response.data,
        }
    }catch(error){
        if(error instanceof AxiosError)
            return{
                success:false,
                error:{
                    message:error.response?.data?.message || "Logout Failed",
                    status:error.response?.status
                }
            }
        
        return{
            success:false,
            error:{message:"An unexpected error occured",
            }
        }
    }
}

