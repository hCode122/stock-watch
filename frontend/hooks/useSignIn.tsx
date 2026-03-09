import { useState, useEffect } from "react"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useSignIn = async ({password, email, rememberMe} : {email: string, password: string, rememberMe:boolean}) => {
    try {
        const response = await axios.post(`${API_BASE}/api/auth/signin`, {password, email})

        if (response.data.success) {
            return ({
                success: true,
                data: response.data 
            })
        } else {
            return ({
                success: false,
                error: response.data.message || 'Signup failed' 
            })
        }
    } catch (error: any) {
        console.error('Signup error:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || 'Network error occurred' 
        };
        
    }
}