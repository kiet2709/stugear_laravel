import axios from "axios";
import useRefreshToken from "../hooks/useRefreshToken";
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:3000/api";

const LOGIN_PAGE_URL = '/login';
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;

axiosPrivate.interceptors.request.use(
  (request) => {


    request.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "access_token"
    )}`;

    return request;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => {

    return response;
  },
  async (error) => {
    console.log("innnnnn")
    const prevRequest = error?.config;
    if (
      (error.response.status === 498 || error.response.status === 403) &&
      !prevRequest?.sent
    ) {
      prevRequest.sent = true;
      
      console.log("Refresh access Token")
      const refresh = await useRefreshToken();
      if (refresh?.refresh_token) {
        
        localStorage.setItem("access_token", refresh?.access_token);
        localStorage.setItem("refresh_token", refresh?.refresh_token);
        localStorage.setItem("user_id", refresh?.user_id);
        localStorage.setItem("roles", refresh?.roles);
        localStorage.setItem("username", refresh?.username);

        return axiosPrivate(prevRequest);
      } else {
        console.log("Hết cứu")
        localStorage.removeItem("user_id")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("username")
        localStorage.removeItem("roles")
        localStorage.removeItem("access_token")
        window.location.href = "/login"
      }
    } else if (error.response.status === 500){
      console.log("500 rui")
      console.log(error)
      // window.location.href = "/internal-error" 
    } else if (error.response.status === 401){
      console.log("Need login")
      window.location.href = "/login"
    } else if (error.response.status === 400){
      return Promise.reject(error)
    }
  }
);

export { axiosPrivate };
