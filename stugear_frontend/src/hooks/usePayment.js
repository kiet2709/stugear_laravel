import { useContext } from 'react'
import { PaymentContext } from '../context/PaymentProvider'

const usePayment = () => {
  return useContext(PaymentContext)
}

export default usePayment
