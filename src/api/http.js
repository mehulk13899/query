import { getAuthCredentials } from "./auth-utils";
import { API_ENDPOINTS } from "./endpoints";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // TODO: take this api URL from env
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Change request data/error here
http.interceptors.request.use(
  (config) => {
    const { token } = getAuthCredentials();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Change response data/error here
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403)
    ) {
      Cookies.remove("AUTH_CRED");
      const navigate = useNavigate();
      navigate(API_ENDPOINTS.LOGIN);
    }
    return Promise.reject(error);
  }
);
export default http;
