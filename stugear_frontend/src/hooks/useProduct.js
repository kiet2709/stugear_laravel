import { useContext } from 'react'
import { ProductContext } from '../context/ProductProvider'

const useProduct = () => {
  return useContext(ProductContext)
}

export default useProduct
