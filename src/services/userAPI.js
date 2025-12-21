import axios from "axios";

const URL = import.meta.env.VITE_USER_API;

const register = async (payload) => {
    const response = await axios.post(`${URL}/add`, payload, {
        headers: {
            'Content-Type': 'application/json', // Tentukan content type
            // 'Authorization': `Bearer ${token}`, // Jika butuh auth
        }
    });
    return response.data;
};

const login = async (payload) => {
    const response = await axios.post(`${URL}/login`, payload, {
        headers: {
            'Content-Type': 'application/json', // Tentukan content type
            // 'Authorization': `Bearer ${token}`, // Jika butuh auth
        }
    });
    return response.data;
};

export { register, login };
