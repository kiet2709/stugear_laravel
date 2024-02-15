import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth";
import "./AdminSideBar.css";
import { useNavigate } from "react-router-dom";

const AdminSideBar = () => {
  const navigate = useNavigate();
  
  const { user, setUser } = useAuth();


  const signOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    setUser("");
    navigate("/login");
  };

  return (
    <>
      <nav
        id="sidebar"
        className={`admin-sidebar sidebar`}
      >

        <div className="p-4 pt-5">
          <h1>
            <p className="logo">STUGEAR</p>
          </h1>
          <div className="text-center">
            <Link to={"/member/general"}>
              <img
                src={user?.user_image}
                alt=""
                className="rounded-circle"
                style={{ width: "40%", height: "70px" }}
              />
            </Link>
          </div>
          <button
            className="btn admin-logout ms-5 my-4"
            onClick={(e) => signOut(e)}
          >
            Đăng xuất
          </button>

          <nav className="list-group">
          <NavLink className="list-group-item" to={"/admin/categories"}>
              <FontAwesomeIcon
                icon="ticket"
                style={{ marginRight: "10px" }}
              />{" "}
              Danh mục
            </NavLink>
            <NavLink
              className="list-group-item with-badge"
              to={"/admin/users"}
            >
              <FontAwesomeIcon icon="user" style={{ marginRight: "10px" }} />{" "}
              Người dùng
            </NavLink>
            <NavLink className="list-group-item" to={"/admin/products"}>
              <FontAwesomeIcon
                icon="book"
                style={{ marginRight: "10px" }}
              />{" "}
              Sản phẩm
            </NavLink>
            <NavLink
              className="list-group-item with-badge "
              to={"/admin/reports"}
            >
              <FontAwesomeIcon
                icon="flag"
                style={{ marginRight: "10px" }}
              />{" "}
              Đơn tố cáo
            </NavLink>
            <NavLink
              className="list-group-item with-badge "
              to={"/admin/withdraws"}
            >
              <FontAwesomeIcon
                icon="money-bill"
                style={{ marginRight: "10px" }}
              />{" "}
              Yêu cầu rút tiền
            </NavLink>
            <NavLink
              className="list-group-item with-badge "
              to={"/admin/orders"}
            >
              <FontAwesomeIcon
                icon="cart-shopping"
                style={{ marginRight: "10px" }}
              />{" "}
              Đơn hàng
            </NavLink>

          </nav>
        </div>
      </nav>
    </>
  );
};

export default AdminSideBar;
