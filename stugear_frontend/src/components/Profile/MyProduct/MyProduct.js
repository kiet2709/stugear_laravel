import "./MyProduct.css";
import ProductCard from "../../Product/ProductCard/ProductCard";
import UserService from "../../../service/UserService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomPagination from "../../../components/Pagination/Pagination";
import Loading from "../../Loading";
import { useNavigate } from "react-router-dom";
const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
  const getProductsByCurrentUser = async () => {
    
    setLoading(true);
    const response = await UserService.getCurrentUserProducts(currentPage);
    console.log(response)
    setTotalPage(response?.total_page);
    setProducts(response?.data);
    
    setLoading(false);
  };

  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleProductLink = (status, id) =>{
    
    if (status==="Đã duyệt" || status === "Đã bán"){
      return `/home-page/product-detail/${id}` 
    }else if (status ==="Chờ duyệt"){
      return `/home-page/product-detail/${id}` 
    } else if (status==="Nháp"){
      return `/member/upload/${id}`  
    }
  }

  useEffect(() => {
    getProductsByCurrentUser();
  }, [currentPage]);
  const handleUpload = async () => {
    const response = await UserService.getCurrentUser()
    if (response?.is_verify == "false"){
      const result = UserService.sendVerifyEmail(response?.email)
      navigate("/verify")
    }else{
      navigate("/member/upload")
    }
  }
  return (
    <>
      <div className="row mb-5">
        {isLoading ? (
          <Loading />
        ) : (
          <>
          {products.length == 0 ? (
              <>
              <div className="text-center mt-3">
                Không có sản phẩm nào. <Link onClick={() => handleUpload()}>Đăng bán ?</Link>
              </div>
              </>
          ): 
          (
              <>
              {products.map((product) => (
              <div className="col-4 mt-5">
                <Link
                  className="my-product-item"
                  style={{ textDecoration: "none", color: "black" }}
                  to={handleProductLink(product?.status, product?.id)}
                >
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
              </>
          )}
            
          </>
        )}
      </div>
      <CustomPagination 
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage}
        />
    </>
  );
};

export default MyProduct;
