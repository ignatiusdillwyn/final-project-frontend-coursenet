import axios from "axios";

const URL = 'https://api-toko-pak-edi.dillwyn.my.id/api/products';

const addProduct = async (payload, token) => {
    const response = await axios.post(`${URL}/create`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const fetchAllProduct = async (token) => {
    const response = await axios.get(`${URL}/getAll`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; // Returns { status, message, products }
};

const updateProduct = async (id, payload, token) => {
    const response = await axios.put(`${URL}/edit/${id}`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const deleteProduct = async (id, token) => {
    const response = await axios.delete(`${URL}/delete/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const searchProduct = async (name, token) => {
    const response = await axios.get(`${URL}/search/${name}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    console.log('response ', response); // Log the response data to see its structure
    return response.data; // Returns { status, products }
};

const updateProductImage = async (id, imageFile, token) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axios.put(
            `${URL}/updateProductImage/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'access_token': token
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export { addProduct, fetchAllProduct, updateProduct, deleteProduct, searchProduct, updateProductImage };