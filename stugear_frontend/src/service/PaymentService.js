import axios from 'axios'
import { axiosPrivate } from '../api/axios';
const PAYMENT_URL = 'https://stugear.website/api/payments'

class PaymentService {
    VNPay(amount) {
        return axiosPrivate
          .post(PAYMENT_URL + "/vnpay-payment",{
            amount: amount
          })
          .then(response => response?.data?.data)
          .catch(error => error?.response);
      }
    MomoPay(amount) {
        return axiosPrivate
          .post(PAYMENT_URL + "/momo-payment",{
            amount: amount
          })
          .then(response => response?.data)
          .catch(error => error?.response);
      }


}

export default new PaymentService()
