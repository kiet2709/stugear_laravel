import { createContext, useState } from 'react'

const PaymentContext = createContext({})

const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState("")


  return <PaymentContext.Provider value={{ paymentStatus, setPaymentStatus }}>{children}</PaymentContext.Provider>
}



export { PaymentContext, PaymentProvider }
