import api from './api'; // Import your configured Axios instance

// Function to log in an admin
export const login = async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    const { token } = response.data;

    // Store the token in local storage
    localStorage.setItem('token', token);

    return response.data; // Return the full response for further use
};

// Function to register a new admin
export const register = async (username, avatar_url, password, secretKey) => {
    const response = await api.post('/admin/register', { username, avatar_url, password, secretKey });
    const { token } = response.data;

    // Store the token in local storage
    localStorage.setItem('token', token);

    return response.data; // Return the full response for further use
};

// Function to log out the admin
export const logout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
};

// Function to get the current admin's details
export const getCurrentAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await api.get('/admin', {
        headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
    });

    return response.data; // Return the admin details
};