import React, { useEffect, useState } from "react";
import "./MyWallet.css"; // Importing the CSS file

import useAuth from "../../../hooks/useAuth";
import PaymentService from "../../../service/PaymentService";
import usePayment from "../../../hooks/usePayment";
import Loading from "../../Loading";
import UserService from "../../../service/UserService";
import Modal from "react-modal";
import AskService from "../../../service/AskService";
import CustomPagination from "../../Pagination/Pagination";
import { ToastContainer, toast } from "react-toastify";
const BalancePage = () => {
  const [amountToAdd, setAmountToAdd] = useState("");
  const [method, setMethod] = useState("1");
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState();
  const { paymentStatus, setPaymentStatus } = usePayment();
  const [errorMessage, setError] = useState("");
  const [withDrawError, setWithdrawError] = useState("");
  const [isConfirm, setConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [withdraws, setWithdraws] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [withdrawRequest, setWithdrawRequest] = useState({
    amount: 20000,
    description: "",
  });
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handleInputChange = (e) => {
    setError("");
    setAmountToAdd(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayement();
  };

  const handlePayement = async () => {
    if (method === "1") {
      const response = await PaymentService.MomoPay(amountToAdd);
      console.log(response);
      if (response?.status === 400) {
        setError(response?.data?.message);
      } else {
        setPaymentStatus("Đang thanh toán");
        window.open(response?.payUrl);
      }
    } else if (method === "2") {
      const response = await PaymentService.VNPay(amountToAdd);
      console.log(response);
      if (response?.status === 400) {
        setError(response?.data?.message);
      } else {
        setPaymentStatus("Đang thanh toán");
        window.open(response);
      }
    }
  };
  const getCurrentBalance = async () => {
    const balanceResponse = await UserService.getCurrentUserBalance();
    if (balanceResponse.status !== 400) {
      setBalance(balanceResponse.balance);
      setUser({ ...user, balance: balanceResponse.balance });
      localStorage.setItem("balance", balanceResponse.balance);
    }
  };
  const getWithdrawHistory = async (page) => {
    setLoading(true);
    const response = await AskService.getListWithdrawsHistory(page);
    if (response.status !== 400) {
      setWithdraws(response?.data);
      setTotalPage(response?.total_page);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (paymentStatus === "Thanh toán thành công") {
      getCurrentBalance();
    }
  }, [paymentStatus]);
  useEffect(() => {
    getCurrentBalance();
  }, []);

  useEffect(() => {
    getWithdrawHistory(currentPage);
  }, [currentPage]);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setWithdrawError("")
    setWithdrawRequest({amount: 20000, description: ""})
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const handleSubmitReturn = async (e) => {
    e.preventDefault();

    const response = await AskService.requestWithdraw(
      withdrawRequest.amount,
      withdrawRequest.description
    );
    if (response?.status === 400) {
      setWithdrawError(response?.data?.message);
    } else {
      setIsOpen(false);
      setConfirm(true);
      toast.success("Yêu cầu rút tiền thành công!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setCurrentPage(1);
    }
  };

  return (
    <>
      <>
        <div className="balance-page text-center ">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <>
              <div className="form-group mb-2" style={{ minWidth: "300px" }}>
                <p className="form-label">Số tiền</p>
                <div className="input-group ">
                  <input
                    type="number"
                    name="amount"
                    value={withdrawRequest.amount}
                    onChange={(e) => {
                      setWithdrawRequest({
                        ...withdrawRequest,
                        amount: e.target.value,
                      });
                      setWithdrawError("");
                    }}
                    placeholder="Nhập số tiền muốn hoàn"
                    min={0}
                    className="form-control"
                  />
                  <span className="input-group-text">VNĐ</span>
                </div>
                {withDrawError !== "" ? (
                  <>
                    <span
                      className="text-danger mb-2"
                      style={{ fontSize: "12px" }}
                    >
                      {withDrawError}
                    </span>
                  </>
                ) : (
                  <></>
                )}
                <div>
                  <label className="form-label">Nội dung yêu cầu</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    name="content"
                    value={withdrawRequest.description}
                    onChange={(e) =>
                      setWithdrawRequest({
                        ...withdrawRequest,
                        description: e.target.value,
                      })
                    }
                    placeholder="Nhập só tài khoản, lý do rút tiền,... "
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn" onClick={(e) => handleSubmitReturn(e)}>
                  Gửi
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "red" }}
                  onClick={closeModal}
                >
                  Thoát
                </button>
              </div>
            </>
          </Modal>

          <div className="row">
            <div className="balance-section  col-5">
              <img
                src="/assets/images/e-wallet.png"
                alt="Wallet Icon"
                className="balance-img"
              />
              <div className="balance-display mt-3">
                <h4>
                  Số dư: <span>{balance}</span>
                </h4>
              </div>
              <button
                className="btn btn-danger mt-4"
                style={{ backgroundColor: "#cc0a0a" }}
                onClick={openModal}
              >
                Rút tiền
              </button>
            </div>
            <div className="col-2">
              <hr className="bg-dark vertical-hr" />
            </div>
            <div className="add-balance-section col text-center">
              {paymentStatus !== "" ? (
                <>
                  <div className="proccess-bar">
                    <div className="d-flex flex-row justify-content-between align-items-center align-content-center">
                      {paymentStatus === "Đang thanh toán" ? (
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
                      {paymentStatus === "Thanh toán thành công" ? (
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
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <div className="d-flex flex-column align-items-start">
                        <span>Đang nạp tiền</span>
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <span>Nạp tiền thành công</span>
                      </div>
                    </div>
                  </div>
                  {paymentStatus === "Đang thanh toán" ? (
                    <>
                      <div className="mt-5">
                        <Loading />
                        <p>Vui lòng hoàn tất quá trình nạp tiền của bạn</p>
                        <button
                          className="btn"
                          onClick={() => setPaymentStatus("")}
                        >
                          Nạp lại
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-success mt-5">
                        Bạn đã thanh toán thành công
                      </p>
                      <button
                        className="btn"
                        onClick={() => setPaymentStatus("")}
                      >
                        Nạp thêm
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="add-balance-form "
                    style={{ maxWidth: "300px" }}
                  >
                    <h3 className="mt-5 mb-3">Nhập số tiền cần nạp:</h3>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        value={amountToAdd}
                        onChange={handleInputChange}
                        placeholder="Nhập số tiền"
                        min={0}
                        className="form-control"
                      />
                      <span className="input-group-text"> VNĐ</span>
                      {errorMessage ? (
                        <>
                          <div className="text-danger">{errorMessage}</div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <h3>Chọn phương thức nạp</h3>
                    <div
                      className="radiobtn mx-auto"
                      style={{ maxWidth: "290px" }}
                    >
                      <input
                        type="radio"
                        name="box"
                        id="one"
                        defaultChecked
                        defaultValue={"1"}
                        onChange={(e) => setMethod("1")}
                      />
                      <input
                        type="radio"
                        name="box"
                        id="two"
                        defaultValue={"2"}
                        onChange={(e) => setMethod("2")}
                      />
                      <label htmlFor="one" className="box py-2 first">
                        <div className="d-flex ">
                          <span className="circle" />
                          <div className="course">
                            <div className="d-flex  mb-2">
                              <span className="fw-bold">Momo</span>
                            </div>
                            <span>
                              <img
                                src="/assets/images/momo.png"
                                alt=""
                                style={{ width: "50px", marginRight: "30px" }}
                              />
                            </span>
                          </div>
                        </div>
                      </label>
                      <label htmlFor="two" className="box py-2 second">
                        <div className="d-flex">
                          <span className="circle" />
                          <div className="course">
                            <div className="d-flex  mb-2">
                              <span className="fw-bold">VNPay</span>
                            </div>
                            <img
                              src="/assets/images/vnpay.png"
                              alt=""
                              style={{ width: "100px", marginRight: "30px" }}
                            />
                          </div>
                        </div>
                      </label>
                    </div>

                    <button type="submit" className="mt-3">
                      Nạp
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
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
          <div className="mt-5 mb-2">
            <h3>Lịch sử rút tiền</h3>
            {isLoading ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                <table
                  class="table table-bordered"
                  style={{ background: "#7355F7" }}
                >
                  <thead>
                    <>
                      {" "}
                      <tr>
                        <th
                          className="text-white"
                          style={{ background: "#7355F7" }}
                          scope="col"
                          width="15%"
                        >
                          ID
                        </th>

                        <th
                          className="text-white"
                          style={{ background: "#7355F7" }}
                          scope="col"
                          width="15%"
                        >
                          Số tiền
                        </th>
                        <th
                          className="text-white"
                          style={{ background: "#7355F7" }}
                          scope="col"
                        >
                          Nội dung
                        </th>
                        <th
                          className="text-white"
                          style={{ background: "#7355F7" }}
                          scope="col"
                        >
                          Ngày tạo
                        </th>
                        <th
                          className="text-white"
                          style={{ background: "#7355F7" }}
                          scope="col"
                        >
                          Trạng thái
                        </th>
                      </tr>
                    </>
                  </thead>
                  <tbody>
                    <>
                      {" "}
                      {withdraws?.map((withdraw) => {
                        return (
                          <tr>
                            <th className="text-center">{withdraw?.id}</th>
                            <td className="text-center">{withdraw?.amount}</td>
                            <td className="text-center">
                              {withdraw?.description}
                            </td>
                            <td>{withdraw?.date}</td>
                            <td>{withdraw?.status}</td>
                          </tr>
                        );
                      })}
                    </>
                  </tbody>
                </table>
              </>
            )}

            <div className="mt-4 ">
              <CustomPagination
                currentPage={currentPage}
                totalPage={totalPage}
                prevPage={prevPage}
                nextPage={nextPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default BalancePage;
