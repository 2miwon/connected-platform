import axios from "axios";

const API_URL = "http://3.36.212.250:3000";

export const fetchAllVideos = () => {
    const response = axios.get(`${API_URL}/videos/all`);
    console.log(response);
}
