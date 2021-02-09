import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3000/api/",
    responseType: "json",
    headers: { Authorization: `Bearer ${window.location.search.slice(1)}` },
});