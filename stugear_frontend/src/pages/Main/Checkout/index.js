import "./index.css";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import Loading from "../../../components/Loading/index";
import UserService from "../../../service/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faEnvelope,
  faGlobe,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../service/OrderService";
import UserModal from "../../../components/Profile/UserModal/UserModal";
const CheckoutPage = () => {
  const { user, setUser } = useAuth();
  const [owner, setOwner] = useState();
  const navigate = useNavigate();
  let { slug } = useParams();
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userInfo, setUserInfo] = useState({});
  const [product, setProduct] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState();
  const [isError, setError] = useState("");
  const getProductById = async (id) => {
    setLoading(true);
    const response = await ProductService.getProductById(id);
    if (response.status == 404) {
      navigate("/not-found");
    } else {
      setProduct(response);
      await getUserById(response?.owner_id);
      setTotalPrice(response?.price);
    }
    setLoading(false);
  };
  const getCurrentUserInfo = async () => {
    setLoading(true);
    const response = await UserService.getCurrentUser();
    if (response.status !== 400) {
      setUserInfo(response);
      setAddress(response?.full_address);
    }
    setLoading(false);
  };
  const handleQuantity = (e) => {
    setQuantity(e.target.value);

    // Convert the price to a number and calculate the total
    const total = product?.price.replace(/[^0-9.-]+/g, "") * e.target.value;

    // Format the total as a number with commas
    const formattedTotal = new Intl.NumberFormat("vi-VN").format(total);

    // Append 'VNĐ' to the formatted total
    setTotalPrice(formattedTotal + " VNĐ");
  };
  const getUserById = async (id) => {
    const response = await UserService.getUserById(id);
    console.log(response);
    if (response?.status !== 400) {
      setOwner(response[0]);
    }
  };

  useEffect(() => {
    if (slug) {
      const productId = slug;
      getProductById(productId);
    } else {
      navigate("/not-found");
    }

    getCurrentUserInfo();
  }, []);

  const handleCheckout = async () => {
    const response = await OrderService.createOrder(
      product.id,
      quantity,
      product?.price.replace(/[^0-9.-]+/g, "")
    );

    if (response?.status !== 400) {
      const balanceResponse = await UserService.getCurrentUserBalance();
      if (balanceResponse.status !== 400) {
        localStorage.setItem("balance", balanceResponse.balance);
        setUser({ ...user, balance: balanceResponse.balance });
      }
      await UserService.updateUserProfile({full_address: address});
      navigate(`/member/order-detail/${response?.order_id}`);
    } else {
      setError(response?.data?.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="checkout-page  d-lg-flex justify-content-between">
            
           
         
            <div className="box-1 bg-light user">
            <div class="d-flex align-items-center mb-3">
            <UserModal userId={owner?.id} />
                <div className="mt-3">
                  <span className="ps-4 fw-bold info">Người bán:</span>
                  <p className="ps-4 info" style={{fontSize: '12px'}}> {owner?.name}</p>
                </div>
              </div>
              <div className="box-inner-1 pb-3 mb-3 ">
                <div className="d-flex justify-content-between mb-3 userdetails">
                  <p className="fw-bold">{product?.title}</p>
                </div>

                <div
                  className="carousel-item active my-4"
                  style={{ marginLeft: "80px", marginRight: "20px" }}
                >
                  <img
                    src={product?.product_image}
                    className="d-block "
                    style={{ width: "230px", height: "230px" }}
                    alt=""
                  />
                </div>

                <p className="dis info my-3">{product?.description}</p>
                <p>
                  <span className="dis fw-bold info my-3">
                    Phương thức thanh toán:{" "}
                  </span>
                  <span className="dis">{product?.transaction_method}</span>
                </p>
                <p>
                  <span className="dis fw-bold info my-3">Giá: </span>
                  <span className="dis">{product?.price}</span>
                </p>
                <p>
                  <span className="dis fw-bold info my-3">Tình trạng: </span>
                  <span className="dis">{product?.condition}</span>
                </p>
                <p>
                  <span className="dis fw-bold info my-3">Còn lại: </span>
                  <span className="dis">{product?.quantity}</span>
                </p>

                <div className="input-group mb-3">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {handleQuantity(e); setError("")}}
                    placeholder="Nhập số lượng"
                    min={1}
                    className="form-control"
                  />
                  <span className="input-group-text"> Sản phẩm</span>
                </div>
               
              </div>
            </div>
            <div className="box-2">
              <div className="box-inner-2">
                <p className="fw-bold mb-2">Thông tin cá nhân</p>
                <form action>
                  <div
                    className="mb-3"
                    style={{ backgroundColor: "#DDDDDD", padding: "20px" }}
                  >
                    <div className="d-flex my-2">
                      <Link to={"/member/general"}>
                        <img
                          src={user?.user_image}
                          className="pic rounded-circle"
                          style={{ width: "40px" }}
                          alt=""
                        />
                      </Link>
                      <p className="dis ps-2 mt-2 name">{user?.username}</p>
                    </div>
                    <span className="dis ms-1 my-3">
                      <FontAwesomeIcon icon={faEnvelope} /> Email:{" "}
                      {userInfo?.email}
                    </span>
                    <div className="mt-3">
                      <img
                        src="/assets/images/e-wallet.png"
                        alt=""
                        className="w-10"
                        style={{ width: "20px" }}
                      />
                      <span className="dis">
                        {" "}
                        Số dư: {localStorage.getItem("balance")}{" "}
                        <Link to={"/member/wallet"}>.Nạp tiền?</Link>
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="fw-bold">Chi tiết thanh toán</p>
                    <p className="dis mb-3">
                      Xin vui lòng điền đầy đủ thông tin để thanh toán
                    </p>
                  </div>

                  <div>
                    <div className="address">
                      <p className="dis fw-bold mb-3">
                        Địa chỉ giao hàng <span className="text-danger">*</span>
                      </p>
                      <input
                        className="form-control"
                        value={address}
                        onInput={(e) => {
                          setAddress(e.target.value);
                        }}
                      />
                      {address === "" ? (
                        <>
                          <p className="dis my-3" style={{ color: "red" }}>
                            Vui lòng thêm địa chỉ giao hàng
                          </p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div>
                      <hr className=" my-3 bg-dark"></hr>
                      <div className="d-flex flex-column dis">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <p>Giá</p>
                          <p>
                            <span className="fas fa-dollar-sign" />
                            {product?.price}
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <p>Số lượng</p>
                          <p>
                            <span className="fas fa-dollar-sign" />
                            {quantity}
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <p>
                            VAT <span>(0%)</span>
                          </p>
                          <p>
                            <span className="fas fa-dollar-sign" />0 VNĐ
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <p className="fw-bold">Tổng</p>
                          <p className="fw-bold">
                            <span className="fas fa-dollar-sign" />
                            {totalPrice}
                          </p>
                        </div>
                        {isError !== "" ? (
                          <>
                            <p className="text-danger">{isError}</p>
                          </>
                        ) : (
                          <></>
                        )}

                        {address === "" || isError ? (
                          <>
                            <button className="btn btn-primary mt-2" disabled>
                              Thanh toán {totalPrice}
                            </button>
                          </>
                        ) : (
                          <>
                            <div
                              className="btn btn-primary mt-2"
                              onClick={() => handleCheckout()}
                            >
                              Thanh toán {totalPrice}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutPage;
