import { useState, useEffect } from "react"
import axios from "axios"
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useSignUp = async ({username, password, email} : {username: string, password: string, email:string}) => {
    try {
        const response = await axios.post(`${API_BASE}/api/auth/signup`, {username, password, email})

        if (response.data.success) {
            console.log(response.data)
            return { 
                success: true, 
                data: response.data 
            };
        } else {
            return { 
                success: false, 
                error: response.data.message || 'Signup failed' 
            };
        }
    } catch (error: any) {
        console.error('Signup error:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || 'Network error occurred' 
        };
    }
}