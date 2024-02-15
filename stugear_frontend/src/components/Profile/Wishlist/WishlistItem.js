import "./WishlistItem.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import UserService from "../../../service/UserService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import CustomModal from "../../Modal/Modal";
import useProduct from "../../../hooks/useProduct";
const WishlistItem =({item, setKey}) =>{

  const [isRemoved, setRemoved] = useState(false)
  const {productCount, setProductCount} = useProduct()
  const [show, setShow] = useState(false);
  const handleClose =() => {
    setShow(false)
  }
  const handleSave = () => {
    handleRemoveItem()
  }
  const handleRemoveItem = async () => {
    const response = await UserService.removeCurrentUserWishListByProductId(item.id)
    if(response?.status === 500){
      console.log("Something went wrong")
    }
    else{
      setRemoved(true)
      setKey(prev => prev+1)
      toast.success('Xóa sản phẩm thành công!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        localStorage.setItem("wishlist", parseInt(productCount.wishlist) - 1)
        setProductCount({...productCount, wishlist: parseInt(productCount.wishlist) - 1})
    }
  }

    return (
        <tr>
        <td>
          <div className="product-item d-flex ">
            <Link className="product-thumb" to={`/home-page/product-detail/${item.id}`}>
              <img
                className="large-image"
                src={item.product_image}
                alt="Product"
              />
            </Link>
            <div className="product-info my-auto ms-4">
              <h4 className="product-title py-2">
                <Link style={{textDecoration: 'None', color: 'Black'}} to={`/home-page/product-detail/${item.id}`}>{item.name}</Link>
              </h4>
              <div className="text-lg text-medium text-muted py-2">
                {item.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} 
              </div>
              <div>
                Tình trạng:
                <div className="d-inline text-success py-2">
                  {" "}
                  {item.status === "Đã duyệt" ? "Đang bán" : item.status}
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div className="mt-5">
            <Link style={{textDecoration: 'None', color: 'Black'}} onClick={() => setShow(true)}>
              <FontAwesomeIcon icon="trash-can" size="2x"/>
            </Link>
            {isRemoved && (
              <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
            )}
          </div>
        </td>
        <CustomModal handleSave={handleSave} handleClose={handleClose} show={show} heading={"Xóa sản phẩm"} body={"Bạn muốn xóa đi sản phẩm này ra khỏi danh sách yêu thích?"}></CustomModal>
        
      </tr>
    )
}
export default WishlistItem