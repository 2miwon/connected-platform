import axios from "axios";

const API_URL = "http://3.36.212.250:3000";

export const debug = async () => {
    const response = await axios.get(`${API_URL}/debug`);
    return response.data;
}

export const fetchAllVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/video/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchMyVideos = async (user) => {
  try {
    const response = await axios.get(`${API_URL}/video/user/${user.id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const addVideo = async (title, content, url, user) => {
  try {  
    const response = await axios.post(`${API_URL}/video/create`, {
      title: title,
      content: content,
      url: url,
      author_id: user.id
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}