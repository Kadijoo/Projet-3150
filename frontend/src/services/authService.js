import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/users";

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/login`, userData);
  return response.data;
};

export const registerUser = async (data, role) => {
  const isFormData = data instanceof FormData;
  const url =
    role === "restaurateur"
      ? "http://localhost:5000/api/users/register/restaurateur"
      : "http://localhost:5000/api/users/register/client";

  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  const response = await axios.post(url, data, config);
  return response.data;
};



/*export const registerUser = async (userData) => {
  const role = userData.type_utilisateur; // "client" ou "restaurateur"
  const endpoint = `${API_BASE_URL}/register/${role}`;
  const response = await axios.post(endpoint, userData);
  return response.data;
};*/



/*import axios from "axios";

const API_URL = "http://localhost:5000/api/users/login";

export const loginUser = async ({ email, mot_de_passe, type_utilisateur }) => {
  const response = await axios.post(API_URL, {
    email,
    mot_de_passe,
    type_utilisateur
  });
  return response.data;
};


export const registerUser = async (userData) => {
  const role = userData.type_utilisateur;
const endpoint = `${API_URL}/register/${role}`;
const response = await axios.post(endpoint, userData);
  return response.data;
};*/