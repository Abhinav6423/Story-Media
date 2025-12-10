import axios from "axios"

export const registerUser = async (username , email , password , profilePic) => {
    try {
        const res = await axios.post(`${process.env.VITE_BACKEND_URL}/api/auth/register`, {
            username,
            email,
            password,
            profilePic
        }, { withCredentials: true })

        return {
            success: true,
            message: "User registered successfully",
            data: res?.data
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data
        }
    }
}