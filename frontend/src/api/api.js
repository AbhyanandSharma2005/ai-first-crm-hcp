import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

export default API;