import axios from "axios";
import { axiosPrivate } from "../api/axios";
const USER_URL = "http://localhost:8000/api/users";

class UserService {
  getCurrentUserWishlist() {
    return axiosPrivate
      .get(USER_URL + "/wishlists")
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  removeCurrentUserWishListByProductId(id) {
    console.log(id);
    return axiosPrivate
      .post("http://localhost:8000/api/wishlists/remove", {
        product_id: id,
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  addCurrentWishtlistByProductId(productId) {
    return axiosPrivate
      .post(USER_URL + "/wishlists", {
        product_id: productId,
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getCurrentUser() {
    return axiosPrivate
      .get(USER_URL + "/info")
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getCurrentUserImage(id) {
    return axiosPrivate
      .get(USER_URL + `/${id}/images`)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getCurrentUserProducts(currentPage) {
    let url = `http://localhost:8000/api/products/current`;
    if (currentPage !== undefined) {
      url += `?page=${currentPage}&limit=3`;
    }else{
      url += `?page=1&limit=100`;
    }

    return axiosPrivate
      .get(
        url
      )
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  sendVerifyEmail(email) {
    return axiosPrivate
      .get(
        `http://localhost:8000/api/products/send-verify-email?email=${email}`
      )
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
  getTopContributors() {
    return axios
      .get(USER_URL)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
  uploadImage(userId, file) {
    console.log(file);
    return axiosPrivate
      .post(
        USER_URL + `/${userId}/upload-image`,
        {
          image: file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
  updateUserProfile(userInfo) {
    if(userInfo?.gender === ""){
      userInfo.gender = 0
    }
    return axiosPrivate
      .patch(USER_URL + "/info", {
        first_name: userInfo?.first_name,
        last_name: userInfo?.last_name,
        phone_number: userInfo?.phone_number,
        social_link: userInfo?.social_link,
        birthdate: userInfo?.birthdate,
        address: userInfo?.full_address,
        gender: userInfo?.gender
      })
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
  getAllUsers() {
    return axiosPrivate
      .get(USER_URL)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  updateUserStatus(userId, status) {
    return axiosPrivate
      .patch(USER_URL + `/status/${userId}`, {
        user_id: status,
        status: status,
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getUserById(userId){
    return axiosPrivate
    .get(USER_URL + `/${userId}`)
    .then((response) => response?.data?.data)
    .catch((error) => error?.response);
}
  getCurrentUserBalance(){
    return axiosPrivate
    .get(USER_URL + '/balance')
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

  getCurrentUserOrdersHistory(){
    return axiosPrivate
    .get(USER_URL + '/buy/orders?page=1&limit=10')
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }
  
  getCurrentUserOrders(){
    return axiosPrivate
    .get(USER_URL + '/sell/orders?page=1&limit=10')
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }
}

export default new UserService();
