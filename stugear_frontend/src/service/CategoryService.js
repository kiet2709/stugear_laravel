import axios from 'axios'
import { axiosPrivate } from "../api/axios";
const CATEGORY_URL = 'http://localhost:8000/api/categories'
class CategoryService {
  getAllCategories () {
    return axios.get(CATEGORY_URL)
      .then(response => response?.data?.data)
      .catch(error => error?.response)
  }

  getCategoriesById (id) {
    return axios.get(CATEGORY_URL + `/${id}`)
      .then(response => response?.data?.data)
      .catch(error => error?.response)
  }

  getStatisticByCategoryId (id) {
    return axios.get(CATEGORY_URL + `/${id}/statistic`)
      .then(response => response?.data?.data)
      .catch(error => error?.response)
  }

  uploadImage(id, formData){
    return axiosPrivate.post(CATEGORY_URL + `/${id}/upload-image`, formData)
    .then(response => response?.data?.data)
    .catch(error => error?.response)
  }

  updateById(id, category){
    return axiosPrivate.patch(CATEGORY_URL + `/${id}`, {
      name : category?.name,
      description: category?.description
  })
    .then(response => response?.data?.data)
    .catch(error => error?.response)
  }

  create(category){
    return axiosPrivate.post(CATEGORY_URL, {
      name : category?.name,
      description: category?.description
  })
    .then(response => response?.data?.data)
    .catch(error => error?.response)
  }
}

export default new CategoryService()
