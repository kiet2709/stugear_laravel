import axios from "axios";
import { axiosPrivate } from "../api/axios";

const PRODUCT_URL = "http://localhost:8000/api/products";
class ProductService {
  getProductsByCategoryId(id, page) {
    return axios
      .get(PRODUCT_URL + `/category/${id}?page=${page}&limit=5`)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  getProductById(id) {
    return axios
      .get(PRODUCT_URL + `/${id}`)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  getCommentsByProductId(id, currentPage) {
    return axios
      .get(PRODUCT_URL + `/${id}/comments?page=${currentPage}&limit=3`)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  getRatingByProductId(id) {
    return axios
      .get(PRODUCT_URL + `/${id}/ratings`)
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  createCommentByProductId(id, comment) {
    return axiosPrivate
      .post(PRODUCT_URL + `/${id}/comments`, {
        content: comment.content,
        parent_id: comment?.parent_id ? comment.parent_id : 0,
        reply_on: comment?.reply_on ? comment.reply_on : 0,
        product_id: id,
        rating: comment?.rating ? comment.rating : 0,
      })

      .then((response) => response)
      .catch((error) => error?.response);
  }

  attachTag(productId, tags) {
    return axiosPrivate.patch(PRODUCT_URL + `/${productId}/attach-tag`, {
      tags: tags,
    });
  }

  uploadImage(productId, formData) {
    console.log(formData);
    return axiosPrivate.post(
      PRODUCT_URL + `/${productId}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then((response) => response?.data?.data)
    .catch((error) => error?.response);
  }

  getImageByProductId(productId) {
    return axiosPrivate
      .get(PRODUCT_URL + `/${productId}/images`)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
  createDraft(product) {
    return axiosPrivate
      .post(PRODUCT_URL + "/draft", {
        name: product.name,
        price: product.price,
        condition: product.condition,
        edition: product.edition,
        origin_price: product.origin_price,
        quantity: product.quantity,
        brand: product.brand,
        category_id: product.category_id,
        transaction_id: product.transaction_id,
        description: product.description,
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  updateProduct(product) {
    console.log({
      id: product.id,
      name: product.name,
      price: product.price,
      condition: product.condition,
      edition: product.edition,
      origin_price: product.origin_price,
      quantity: product.quantity,
      brand: product.brand,
      status: product.status,
      category_id: product.category_id,
      transaction_id: product.transaction_id,
      description: product.description,
    });
    return axiosPrivate
      .patch(PRODUCT_URL +  `/${product.id}/update`, {
        name: product.name,
        price: product.price,
        condition: product.condition,
        edition: product.edition,
        origin_price: product.origin_price,
        quantity: product.quantity,
        brand: product.brand,
        status: product.status,
        category_id: product.category_id,
        transaction_id: product.transaction_id,
        description: product.description,
      })
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  createProduct(product) {
    console.log({
      name: product.name,
      price: product.price,
      condition: product.condition,
      edition: product.edition,
      origin_price: product.origin_price,
      quantity: product.quantity,
      brand: product.brand,
      status: product.status,
      category_id: product.category_id,
      transaction_id: product.transaction_id,
      description: product.description,
    });
    return axiosPrivate
      .post(PRODUCT_URL, {
        name: product.name,
        price: product.price,
        condition: product.condition,
        edition: product.edition,
        origin_price: product.origin_price,
        quantity: product.quantity,
        brand: product.brand,
        status: product.status,
        category_id: product.category_id,
        transaction_id: product.transaction_id,
        description: product.description,
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }

  deleteProduct(id){
    return axiosPrivate.delete(PRODUCT_URL + `/${id}`)
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }
  voteCommentByCommentId(id, value){
    axiosPrivate
    .patch(PRODUCT_URL + `/comments/${id}/vote`, {
        vote: value
    })
  }

  updateStatus(id, statusId){
    axiosPrivate
    .patch(PRODUCT_URL + `/status/${id}`, {
        status: statusId
    })
  }

  getAllProducts(currentPage){
    let url = PRODUCT_URL;
    if (currentPage !== undefined) {
      url += `?page=${currentPage}&limit=6`;
    }else{
      url += `?page=1&limit=100`;
    }
    return axios
    .get(url)
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

  getProductsByCriteria(criteria, currentPage){
    console.log(PRODUCT_URL + `/search-criteria?page=${currentPage}&limit=6`)
    return axios
    .post(PRODUCT_URL + `/search-criteria?page=${currentPage}&limit=6`, criteria)
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

  searchInCategory(criteria, currentPage){
    return axios
    .post(PRODUCT_URL + `/category-search?page=${currentPage}&limit=4`, criteria)
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

}

export default new ProductService();
