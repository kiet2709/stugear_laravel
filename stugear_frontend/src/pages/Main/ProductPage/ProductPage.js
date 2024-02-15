import ChatSection from "../../../components/ChatSection/ChatSection";
import Feedback from "../../../components/FeedBack/Feedback";
import ProductDetail from "../../../components/Product/ProductDetail/ProductDetail";
import RelateProduct from "../../../components/RelateProduct/RelateProduct";
import "./ProductPage.css";
import { useParams } from "react-router";
import ProductService from "../../../service/ProductService";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/Modal/Modal";
import useProduct from "../../../hooks/useProduct";
const ProductPage = () => {
  const [product, setProduct] = useState({});
  const {productCount, setProductCount} = useProduct()
  const [relateProducts, setRelateProducrs] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isOwner, setOwner] = useState(false);
  let { slug } = useParams();
  const navigate = useNavigate();
  const getProductById = async (id) => {
    setLoading(true);
    const response = await ProductService.getProductById(id);
    console.log(response);
    if (response?.status === 404) {
      navigate("/not-found");
    }
    if (response?.status === 500) {
      console.log("ProductDetail: Something went wrong");
    } else {
      const userId = localStorage.getItem("user_id");
      if (response?.status === "Chờ duyệt" && response?.owner_id != userId) {
        navigate("/not-found");
      }
      if (userId == response?.owner_id) {
        setOwner(true);
      }
      setProduct(response);
      const relateProducts = await ProductService.getProductsByCriteria({
        "tags": response?.tags.map(tag => tag.id)
      },1);

      setRelateProducrs(relateProducts?.data.filter(relate => relate.id !== response.id))
    }
    setLoading(false);
  };
  const getRelateProduct = async () => {
   
  };
  useEffect(() => {
    getProductById(slug);
    getRelateProduct()
  }, [slug]);
  const [isError, setError] = useState()
  const handleDelete = async () => {
    const response = await ProductService.deleteProduct(product?.id);
    console.log(response)
    if(response?.status === 400){
      setError(response?.data?.message)
      
      return
    }else{
      setProductCount({...productCount, myProduct: productCount.myProduct-1})
      localStorage.setItem("product", productCount.myProduct-1)
    }

    navigate("/home-page/category/1");
  };

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleSave = () => {

    handleDelete();
    setShow(false)

  };
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isOwner === true && product?.status === "Chờ duyệt" ? (
            <>
              <div
                className="product-status mb-5 rounded-xl1"
                style={{
                  backgroundColor: "#F59E0B",
                }}
              >
                <div className="d-flex mb-3">
                  <span
                    className="ping my-2 me-2"
                    style={{ border: "4px solid #10B981" }}
                  ></span>
                  <span>{product.status}</span>
                </div>
                <h4>Sản phẩm của bạn đang chờ được duyệt.</h4>
                <p>Chúng tôi sẽ cho bạn biết khi sản phẩm đã được duyệt</p>
              </div>
            </>
          ) : (
            <></>
          )}
          <h1 id="product-title">{product.title}</h1>

          <hr className="bg-dark my-4"></hr>
          <div className="row">
            <div className="col-8">
              {isOwner ? (
                <>
                
                <ProductDetail product={product} isMember={true} />
               
                </>
               
              ): (
                <>
                <ProductDetail product={product} />
              
                </>
                
              )}
                <div>
                <Feedback productId={product.id} isUnApproved={product?.status == "Chờ duyệt" ? true: false} />
              </div>
   
            </div>
            <div className="col-4">
              {isOwner === true ? (
                <>
                  <div className="mt-4 text-center product-modify">
                    <div className="mb-3">
                      <Link
                        style={{ textDecoration: "None", color: "black" }}
                        to={`/member/upload/${slug}`}
                      >
                        <button className="product-edit ">
                          {" "}
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="me-2"
                          />{" "}
                          Chỉnh sửa
                        </button>
                      </Link>
                    </div>
                    <div>
                      <Link
                        style={{ textDecoration: "None", color: "black" }}
                        onClick={() => setShow(true)}
                      >
                        <button className="product-remove mb-2">
                          <FontAwesomeIcon icon={faTrash} className="me-2" />{" "}
                          Xóa sản phẩm
                        </button>
                        {isError && (
                          <><span className="text-danger">{isError}</span></>
                        )}
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <ChatSection product={product} />
              )}
              <div className="mt-4">
                
                <RelateProduct products={relateProducts} />
              </div>
            </div>
          </div>
          <CustomModal
            handleSave={handleSave}
            handleClose={handleClose}
            show={show}
            heading={"Xóa sản phẩm"}
            body={"Bạn muốn xóa đi sản phẩm này?"}
          ></CustomModal>
        </>
      )}
    </div>
  );
};
export default ProductPage;
