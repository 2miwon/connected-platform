import axios from "axios";

const API_URL = "http://3.36.212.250:3000";

export const debug = async () => {
    const response = await axios.get(`${API_URL}/debug`);
    return response.data;
}

export const ping = async () => {
  const response = await axios.get(`${API_URL}/`);
  if (response.status === 200) {
    return true;
  }
  return false;
}

export const fetchAllVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/video/all`);
    return response.data;
  } catch (error) {
    console.error(error);
 }
}

export const getMyInfo = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/user/my_info/`, {
      token: token
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email: email,
      username: username,
      password: password
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchMyVideos = async (user) => {
  try {
    const response = await axios.get(`${API_URL}/video/user/${user._id}`);
    console.log("Re",response)
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
      author_id: user._id
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const deleteVideo = async (video_id) => {
  try {
    const response = await axios.post(`${API_URL}/video/delete/`, {
      video_id: video_id
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const addBookmark = async (token, video_id) => {
  try {  
    const response = await axios.post(`${API_URL}/user/update`, {
      token: token,
      add_bookmark: video_id,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const deleteBookmark = async (token, video_id) => {
  try {
    const response = await axios.post(`${API_URL}/user/update`, {
      token: token,
      delete_bookmark: video_id,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const addHistory = async (token, video_id) => {
  try {
    const response = await axios.post(`${API_URL}/user/update`, {
      token: token,
      video_history: video_id,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
