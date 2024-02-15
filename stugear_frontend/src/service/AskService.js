import axios from "axios";
import { axiosPrivate } from "../api/axios";
const ASK_URL = "http://localhost:8000/api/asks";

class AskService {
  reportUser(denounced_id, description) {
    return axiosPrivate
      .post(ASK_URL + "/report", {
        denounced_id : denounced_id,
        description : description
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  requestWithdraw(amount, description) {
    return axiosPrivate
      .post(ASK_URL + "/withdraw", {
        amount : amount,
        description : description
      })
      .then((response) => response?.data?.data)
      .catch((error) => error?.response);
  }
  getListReport(currentPage) {
    let url = ASK_URL + '/reports';
    if (currentPage !== undefined) {
      url += `?limit=4&page=${currentPage}`;
    }else{
      url += `?page=1&limit=100`;
    }
  
    return axiosPrivate
      .get(url)
      .then((response) => response?.data)
      .catch((error) => error)
  }  
  getListWithdraws(currentPage){
    let url = ASK_URL + '/withdraws';
    if (currentPage !== undefined) {
      url += `?limit=4&page=${currentPage}`;
    }else{
      url += `?page=1&limit=100`;
    }
    return axiosPrivate
      .get(url)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }
  getListWithdrawsHistory(page){
    return axiosPrivate
      .get(ASK_URL + `/current/withdraws?limit=3&page=${page}`)
      .then((response) => response?.data)
      .catch((error) => error?.response);
  }

  updateReportStatus(reportId, status){
    return axiosPrivate
    .post(ASK_URL + `/handle-report/${reportId}`, {
      status : status
    })
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

  updateWithdrawStatus(withdrawId, status){
    return axiosPrivate
    .post(ASK_URL + `/handle-withdraw/${withdrawId}`, {
      status : status
    })
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

  uploadReportImage(reportId, image){
    return axiosPrivate
    .post(ASK_URL + `/${reportId}/upload-image`, image)
    .then((response) => response?.data)
    .catch((error) => error?.response);
  }

}

export default new AskService();
