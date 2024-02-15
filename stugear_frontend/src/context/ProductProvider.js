import { createContext, useState } from 'react'

const ProductContext = createContext({})

const ProductProvider = ({ children }) => {
  const [productCount, setProductCount] = useState({
    wishlist: localStorage.getItem("wishlist"),
    myProduct: localStorage.getItem("product"),
    myOrder: localStorage.getItem("order")
  })


  return <ProductContext.Provider value={{ productCount, setProductCount }}>{children}</ProductContext.Provider>
}



export { ProductContext, ProductProvider }
