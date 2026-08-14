const API_URL = "http://localhost:5000/api";


// Get saved token
function getToken() {
    return localStorage.getItem("token");
}


// API request helper
async function apiRequest(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };


    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }


    return data;
}