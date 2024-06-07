import axios from "axios";

const API_URL = "http://3.36.212.250:3000";

export const debug = () => {
    const response = axios.get(`${API_URL}/debug`);
    console.log(response);
    return response.data;
}

export const fetchAllVideos = () => {
    const response = axios.get(`${API_URL}/video/all`);
    console.log(response);
    return response.data;
}

export const addVideo = (title, content, url, user) => {
    axios.post(`${API_URL}/video/create`, {
        title: title,
        content: content,
        url: url,
        author_id: user.id
    });
}