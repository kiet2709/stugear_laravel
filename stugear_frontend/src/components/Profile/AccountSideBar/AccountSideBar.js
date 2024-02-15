import { Link, NavLink } from "react-router-dom";
import "./AccountSideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import UserService from "../../../service/UserService";
import AuthService from "../../../service/AuthService";
import { useEffect, useState } from "react";

import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import useProduct from "../../../hooks/useProduct";
import UserAvatar from "./UserAvatar";
const AccountSideBar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { productCount } = useProduct();
  let { user, setUser } = useAuth();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setUser("");
    navigate("/login");
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();

    AuthService.findUserByEmail(userInfo?.email);
    navigate(`/member/reset-password/${userInfo?.email}`);
  };
  const getCurrentUserInfo = async () => {
    setLoading(true);
    const response = await UserService.getCurrentUser();
    setUserInfo(response);
    setLoading(false);
  };
  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    const response = await UserService.getCurrentUser();
    if (response?.is_verify == "false") {
      UserService.sendVerifyEmail(response?.email);
      navigate("/verify");
    } else {
      navigate(`/member/upload/category-id=1`);
    }
    setLoading(false);
  };
  return (
    <>
      <div>
        <UserAvatar userInfo={userInfo}/>
        <nav className="list-group">
          <NavLink
            className="list-group-item with-badge"
            to={"/member/general"}
          >
            <FontAwesomeIcon icon="th" style={{ marginRight: "10px" }} />{" "}
            Thông tin cá nhân
          </NavLink>
          <NavLink className="list-group-item" to={"/member/my-product"}>
            <FontAwesomeIcon
              icon={faProductHunt}
              style={{ marginRight: "10px" }}
            />{" "}
            Sản phẩm của tôi{" "}
            {productCount?.myProduct != 0 && (
              <div className="counter">{productCount?.myProduct}</div>
            )}
          </NavLink>
          <NavLink
            className="list-group-item with-badge "
            to={"/member/my-sell"}
          >
            <FontAwesomeIcon
              icon="money-bill"
              style={{ marginRight: "10px" }}
            />{" "}
            Đơn hàng của tôi{" "}
            {productCount?.myOrder != 0 && (
              <div className="counter">{productCount?.myOrder}</div>
            )}
          </NavLink>
          <NavLink
            className="list-group-item with-badge "
            to={"/member/wishlist"}
          >
            <FontAwesomeIcon icon={faHeart} style={{ marginRight: "10px" }} />{" "}
            Yêu thích{" "}
            {productCount?.wishlist != 0 && (
              <div className="counter">{productCount?.wishlist}</div>
            )}
          </NavLink>
          <NavLink
            className="list-group-item with-badge "
            to={"/member/wallet"}
          >
            <FontAwesomeIcon
              icon={faCreditCard}
              style={{ marginRight: "10px" }}
            />{" "}
            Ví tiền
          </NavLink>
          <NavLink className="list-group-item with-badge " to={"/member/order"}>
            <FontAwesomeIcon icon="reorder" style={{ marginRight: "10px" }} />{" "}
            Lịch sử mua hàng
          </NavLink>
          <Link
            className="list-group-item with-badge "
            onClick={() => handleUpload()}
          >
            <FontAwesomeIcon
              icon="cart-shopping"
              style={{ marginRight: "10px" }}
            />{" "}
            Đăng bán
          </Link>
          <NavLink
            className="list-group-item with-badge"
            to={""}
            onClick={(e) => handleResetPassword(e)}
          >
            <FontAwesomeIcon icon="lock" style={{ marginRight: "10px" }} />{" "}
            Đặt lại mật khẩu
          </NavLink>
        </nav>
      </div>

      <div className="card mt-3">
        <div className="mx-auto my-3 personal-logout-btn">
          <button className="btn" onClick={(e) => handleLogout(e)}>
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
};
export default AccountSideBar;
