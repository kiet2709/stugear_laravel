import "./OrderDetail.css";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../Modal/Modal";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OrderService from "../../service/OrderService";
import Loading from "../Loading";
import UserService from "../../service/UserService";
import UserModal from "../Profile/UserModal/UserModal";
import Modal from "react-modal";
import AskService from "../../service/AskService";
// 1: đang xử lý (auto)
// 2: đang giao hàng (seller)
// 3: đã giao hàng (seller)
// 4: đã nhận được hàng (kết thúc) (buyer)
// 5: hoàn hàng (buyer)
// 6: đã nhận được hàng hoàn  (seller)
// 7: hoàn tiền (admin)
const OrderDetail = () => {
  let { slug } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isConfirm, setConfirm] = useState(false);
  const [order, setOrder] = useState({});
  const [isOwner, setOwner] = useState(false);
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [cancleShow, setCancleShow] = useState(false);
  const [returnShow, setReturnShow] = useState(false);
  const [confirmReturnShow, setConfirmReturnShow] = useState(false);
  const [changeStatusShow, setChangeStatusShow] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState();
  const [status, setStatus] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState();

  const handleConfirmReturnClose = () => {
    setConfirmReturnShow(false);
  };
  const handleConfirmReturnSave = () => {
    handleUpdateStatusOrder(6, "Đã nhận được hàng hoàn", true);
    setConfirmReturnShow(false);
    setConfirm(true);
    toast.success("Hoàn hàng thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleReturnClose = () => {
    setReturnShow(false);
  };
  const handleReturnSave = () => {
    handleUpdateStatusOrder(5, "Hoàn hàng");
    setReturnShow(false);
    setConfirm(true);
    toast.success("Hoàn hàng thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleCancleSave = () => {
    handleUpdateStatusOrder(8, "Đã hủy");
    setCancleShow(false);
    toast.success("Yêu cầu trả hàng thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleCancleClose = () => {
    setCancleShow(false);
  };

  const handleConfirmClose = () => {
    setConfirmShow(false);
  };
  const handleConfirmSave = () => {
    handleUpdateStatusOrder(4, "Đã nhận được hàng");
    setConfirmShow(false);
    setConfirm(true);
    toast.success("Xác nhận đơn hàng thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleSave = () => {
    handleUpdateStatusOrder(4, "Đã nhận được hàng");
    setShow(false);
    setConfirm(true);
    toast.success("Xác nhận đơn hàng thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleUpdateStatusOrder = async (statusId, status, isSeller) => {
    let response = {};
    if (isSeller) {
      response = OrderService.updateStatusBySeller(order.id, statusId);
    } else {
      response = OrderService.updateStatusByBuyer(order.id, statusId);
    }
    if (response?.status !== 400) {
      setOrder({ ...order, status: status });
    } else {
      console.log(response);
      console.log("wrong");
    }
  };
  const getOrder = async (orderId) => {
    setLoading(true);
    let response = await OrderService.getOrderById(orderId);

    if (response?.status !== 400) {
      const formattedProduct = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(response?.product_price);

      const formattedTotal = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(response?.total_price);
      response = {
        ...response,
        product_price: formattedProduct,
        total_price: formattedTotal,
      };

      setOrder(response);
      if (response.owner_id == user.user_id) {
        setOwner(true);
        setStatus(
          response?.status === "Đang xử lý"
            ? 1
            : response?.status === "Đang giao hàng"
            ? 2
            : response?.status === "Đã giao hàng"
            ? 3
            : response?.status === "Đã hủy"
            ? 8
            : response?.status === "Hoàn hàng"
            ? 5
            : response?.status === "Đã nhận được hàng hoàn"
            ? 6
            : 0 // Default or initial status
        );
      }

      setLoading(false);
      if (response?.status === "Đã giao hàng" && isOwner !== true) {
        setShow(true);
      } else if (response?.status === "Đã nhận được hàng" && isOwner == true) {
        getCurrentBalance();
      }
    }
  };
  useEffect(() => {
    if (slug) {
      getOrder(slug);
    } else {
      navigate("/not-found");
    }
  }, [status]);

  const getCurrentBalance = async () => {
    const balanceResponse = await UserService.getCurrentUserBalance();
    if (balanceResponse.status !== 400) {
      setUser({ ...user, balance: balanceResponse.balance });
      localStorage.setItem("balance", balanceResponse.balance);
    }
  };
  const handleStatusChange = () => {
    setChangeStatusShow(true);
  };
  const handleChangeStatusClose = () => {
    setChangeStatusShow(false);
  };
  const handleChangeStatusSave = async () => {
    setError("");
    setChangeStatusShow(false);
    const response = await OrderService.updateStatusBySeller(
      order.id,
      parseInt(selectedStatus)
    );

    if (response?.status !== 400) {
      setStatus(selectedStatus);
    } else {
      setError(response?.data?.message);
    }
  };

  return (
    <>
      <section className="h-100 gradient-custom">
        <CustomModal
          handleSave={handleConfirmReturnSave}
          handleClose={handleConfirmReturnClose}
          show={confirmReturnShow}
          heading={"Xác nhận đã nhận được hàng hoàn"}
          body={
            "Sau khi xác nhận hàng. Nếu có bất kỳ vấn đề gì với hàng của bạn, xin hãy chịu trách nhiệm"
          }
        ></CustomModal>
        <CustomModal
          handleSave={handleConfirmSave}
          handleClose={handleConfirmClose}
          show={confirmShow}
          heading={"Xác nhận đã nhận được hàng"}
          body={
            "Sau khi xác nhận hàng. Nếu có bất kỳ vấn đề gì với hàng của bạn, xin hãy chịu trách nhiệm"
          }
        ></CustomModal>
        <CustomModal
          handleSave={handleReturnSave}
          handleClose={handleReturnClose}
          show={returnShow}
          heading={"Xác nhận muốn trả hàng"}
          body={"Bạn có chắc chắn muốn trả hàng không"}
        ></CustomModal>
        <CustomModal
          handleSave={handleCancleSave}
          handleClose={handleCancleClose}
          show={cancleShow}
          heading={"Xác nhận hủy đơn hàng này"}
          body={"Bạn có muốn hủy đơn hàng ?"}
        ></CustomModal>
        <CustomModal
          handleSave={handleChangeStatusSave}
          handleClose={handleChangeStatusClose}
          show={changeStatusShow}
          heading={"Thay đổi trạng thái đơn hàng"}
          body={`Bạn có muốn thay đổi trạng thái đơn hàng này`}
        ></CustomModal>
        <div className="container-fluid py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-10 col-xl-8">
              <>
                <div className="card" style={{ borderRadius: 10 }}>
                  <div className="card-header px-4 py-5">
                    <h5 className="text-muted mb-0">
                      {isOwner === true &&
                      order?.status === "Đã nhận được hàng" ? (
                        <>
                          <p>Đơn hàng của bạn đã được xử lý thành công</p>
                          <span className="fs-6 text-success">
                            Bạn được cộng thêm: {order.total_price} vào ví ảo.{" "}
                            <Link to={"/member/wallet"}>Xem ví</Link>
                          </span>
                        </>
                      ) : isOwner === true ? (
                        <>
                          <p>Trạng thái đơn hàng: {order?.status}</p>
                        </>
                      ) : (
                        <>
                          <p>
                            Cảm ơn vì đã đặt hàng, {user.username}{" "}
                            <span style={{ color: "#a8729a" }} />!
                          </p>
                        </>
                      )}
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex  mb-4">
                      <p
                        className="lead fw-normal mb-0"
                        style={{ color: "#a8729a" }}
                      >
                        Đơn hàng
                      </p>
                      {isOwner &&
                      order?.status !== "Đã nhận được hàng" &&
                      order?.status !== "Hoàn tiền" &&
                      order?.status !== "Đã giao hàng" &&
                      order?.status !== "Đã nhận được hàng hoàn" ? (
                        <>
                          <select
                            style={{ maxWidth: "240px" }}
                            className="form-select ms-4"
                            aria-label="Default select example"
                            value={status}
                            onChange={(e) => {
                              setSelectedStatus(e.target.value);
                              handleStatusChange();
                            }}
                          >
                            <>
                              {order?.status == "Hoàn hàng" ? (
                                <>
                                  <option value={5}>Hoàn hàng</option>
                                  <option value={6}>
                                    Đã nhận được hàng hoàn
                                  </option>
                                </>
                              ) : (
                                <>
                                  <option value={1}>Đang xử lý</option>
                                  <option value={2}>Đang giao hàng</option>
                                  <option value={3}>Đã giao hàng</option>
                                  {order?.status == "Đang xử lý" && (<option value={8}>Hủy đơn hàng</option>)}
                                  
                                </>
                              )}
                              
                            </>
                          </select>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    {isError ? (
                      <>
                        {" "}
                        <div className="my-3">
                          <span className="text-danger ">{isError}</span>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="card shadow-0 border mb-4">
                      <div className="card-body">
                        <div className="row">
                          <table className="table">
                            <thead>
                              <tr>
                                <th width="5%">Hình</th>
                                <th width="10%">Tựa sách</th>
                                <th width="30%">Giá</th>
                                <th width="30%">Số lượng</th>
                                <th width="30%">Tổng</th>
                                <th width="30%">
                                  {isOwner ? "Người mua" : "Người bán"}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="thumbnail-img">
                                  <Link>
                                    <img
                                      src={order.product_image}
                                      alt=""
                                      className="small-image"
                                    />
                                  </Link>
                                </td>
                                <td className="name-pr">
                                  <div
                                    style={{
                                      height: 70,
                                      width: 250,
                                      overflow: "auto",
                                    }}
                                  >
                                    {order?.product_title}
                                  </div>
                                </td>
                                <td className="price-pr ">
                                  <p>{order.product_price}</p>
                                </td>
                                <td className="quantity-box">
                                  <p>{order.quantity}</p>
                                </td>
                                <td>
                                  <p>{order.total_price}</p>
                                </td>
                                <td>
                                  <div
                                    className="text-center"
                                    style={{
                                      width: 90,
                                    }}
                                  >
                                    <p>
                                      {isLoading ? (
                                        <>
                                          <Loading />
                                        </>
                                      ) : (
                                        <>
                                          {isOwner !== true ? (
                                            <>
                                              <UserModal
                                                userId={order?.owner_id}
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <UserModal
                                                userId={order?.buyer_id}
                                              />
                                            </>
                                          )}
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {isLoading ? (
                          <Loading />
                        ) : (
                          <>
                            {" "}
                            <div className="d-flex flex-row justify-content-between align-items-center align-content-center">
                              {order?.status === "Đang xử lý" ? (
                                <>
                                  <span
                                    className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                  ></span>
                                </>
                              ) : (
                                <>
                                  <span className="dot" />
                                </>
                              )}

                              <hr className="flex-fill track-line" />

                              {order?.status === "Đang giao hàng" ? (
                                <>
                                  <span
                                    className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                  ></span>
                                </>
                              ) : (
                                <>
                                  <span className="dot" />
                                </>
                              )}

                              <hr className="flex-fill track-line" />
                              {order?.status === "Đã hủy" ? (
                                <>
                                  <span
                                    className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                  ></span>
                                </>
                              ) : (
                                <>
                                  {order?.status === "Đã giao hàng" ? (
                                    <>
                                      <span
                                        className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                      ></span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="dot" />
                                    </>
                                  )}
                                  <hr className="flex-fill track-line" />

                                  {order?.status === "Hoàn hàng" ||
                                  ((order?.status == "Đã nhận được hàng hoàn" ||
                                    order?.status == "Hoàn tiền") &&
                                    isOwner != true) ? (
                                    <>
                                      <span
                                        className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                      ></span>
                                    </>
                                  ) : (
                                    <>
                                      {order?.status ==
                                      "Đã nhận được hàng hoàn" ? (
                                        <>
                                          <span
                                            className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                          ></span>
                                        </>
                                      ) : order?.status == "Hoàn tiền" ? (
                                        <>
                                          <span
                                            className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                          ></span>
                                        </>
                                      ) : (
                                        <>
                                          {order?.status ===
                                          "Đã nhận được hàng" ? (
                                            <>
                                              <span
                                                className="d-flex justify-content-center 
     align-items-center big-dot dot"
                                              ></span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="dot" />
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="d-flex flex-row justify-content-between align-items-center">
                              <div className="d-flex flex-column align-items-start">
                                <span>Đang xử lý</span>
                              </div>
                              <div className="d-flex flex-column align-items-start">
                                <span>Đang giao hàng</span>
                              </div>
                              {order?.status == "Đã hủy" ? (
                                <>
                                  {" "}
                                  <div className="d-flex flex-column align-items-start">
                                    <span>Đã hủy</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <div className="d-flex flex-column justify-content-center">
                                    <span>Đã giao hàng</span>
                                  </div>
                                  {order?.status == "Hoàn hàng" ||
                                  ((order?.status == "Đã nhận được hàng hoàn" ||
                                    order?.status == "Hoàn tiền") &&
                                    isOwner != true) ? (
                                    <>
                                      <div className="d-flex flex-column align-items-start">
                                        <span>Hoàn hàng</span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {order?.status ==
                                      "Đã nhận được hàng hoàn" ? (
                                        <>
                                          <div className="d-flex flex-column justify-content-center align-items-center">
                                            <span>Đã nhận hàng hoàn</span>
                                          </div>
                                        </>
                                      ) : order?.status == "Hoàn tiền" ? (
                                        <>
                                          <div className="d-flex flex-column justify-content-center align-items-center">
                                            <span>Hoàn tiền</span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="d-flex flex-column justify-content-center align-items-center">
                                            <span>Đã nhận hàng</span>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between pt-2">
                      <p className="fw-bold mb-0">Chi tiết đơn hàng</p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">Phí giao hàng:</span> 0
                        VNĐ
                      </p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="text-muted mb-0">
                        Mã đơn hàng : {order.id}
                      </p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">Giảm giá:</span> 0 VNĐ
                      </p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className="text-muted mb-0">
                        Ngày đặt hàng : {order.created_date}
                      </p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">VAT:</span> 0 VNĐ
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mb-5">
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-2">Tổng: </span>
                        {order.total_price}
                      </p>
                    </div>
                    <div className="shopping-box">
                      {order?.status === "Đã giao hàng" && isOwner !== true ? (
                        <>
                          <p className="text-success">
                            Có vẻ bạn đã nhận được hàng?. Vui lòng xác nhận:
                          </p>
                          <button
                            className="btn"
                            onClick={() => setConfirmShow(true)}
                          >
                            Xác nhận đã nhận được hàng
                          </button>

                          <p className="text-success mt-3">
                            Nếu hàng có vấn đề, xin hãy tạo yêu cầu hoàn hàng:
                          </p>
                          <button
                            className="btn btn-danger "
                            style={{ backgroundColor: "red" }}
                            onClick={() => setReturnShow(true)}
                          >
                            Yêu cầu hoàn hàng
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    {order?.status === "Đang xử lý" && isOwner != true ? (
                      <>
                        <button
                          className="btn btn-danger mt-3"
                          style={{ backgroundColor: "red" }}
                          onClick={() => setCancleShow(true)}
                        >
                          Hủy đơn hàng
                        </button>
                      </>
                    ) : (
                      <></>
                    )}

                    {order?.status === "Hoàn hàng" && isOwner === true ? (
                      <>
                        <p className="text-success">
                          Bạn đã nhận được hàng hoàn ?
                        </p>
                        <button
                          className="btn btn-danger mt-2"
                          style={{ backgroundColor: "green" }}
                          onClick={() => setConfirmReturnShow(true)}
                        >
                          Xác nhận đã hoàn hàng
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div
                    className="card-footer border-0 px-4 py-5"
                    style={{
                      backgroundColor: "#7355F7",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                      {isOwner === true ? (
                        <>
                          {" "}
                          Tiền nhận được:  {" "}
                          <span className="h2 mb-0 ms-2">
                            {order.total_price}
                          </span>
                        </>
                      ) : (
                        <>
                          {" "}
                          Tiền phải trả:  {" "}
                          <span className="h2 mb-0 ms-2">
                            {order.total_price}
                          </span>
                        </>
                      )}
                    </h5>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
        {isOwner !== true ? (
          <>
            {" "}
            <CustomModal
              handleSave={handleSave}
              handleClose={handleClose}
              show={show}
              heading={"Xác nhận đã nhận được hàng"}
              body={"Có vẻ bạn đã nhận được hàng, xin vui lòng xác nhận"}
            ></CustomModal>
            {isConfirm ? (
              <>
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
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </section>
    </>
  );
};

export default OrderDetail;
