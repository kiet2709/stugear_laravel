import { useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OauthSection from "../../components/OauthSection";
import Divider from "../../components/Divider";
import AuthService from "../../service/AuthService";
import useAuth from "../../hooks/useAuth";
import Loading from "../Loading";
import UserService from "../../service/UserService";
import useProduct from "../../hooks/useProduct";
const LoginForm = () => {
  const { setUser } = useAuth();
  const { setProductCount } = useProduct();
  const [credentials, setCredentials] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    let response = await AuthService.login(credentials);

    if (response.status === 401) {
      setLoading(false);
      setMessage("Mật khẩu không đúng ");
      setError(true);
      return
    } else if (response.status === 500) {
      setLoading(false);
      setMessage("Email chưa được đăng ký");
      setError(true);
      return
    } else if(response.status === 403){
      setLoading(false);
      setMessage("Tài khoản bị chặn");
      setError(true);
      return
    }
    else {
      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;
      const userId = response.user_id;
      const username = response.username;
      const roles = response.roles;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("roles", roles);
      const balanceResponse = await UserService.getCurrentUserBalance();
      if (balanceResponse.status !== 400) {
        localStorage.setItem("balance", balanceResponse.balance);
      }
      response = { ...response, balance: balanceResponse.balance };
      setUser(response);
      await getUserInfo()
      localStorage.setItem(
        "user_image",
        `http://localhost:8000/api/users/${response?.user_id}/images`
      );
      setUser({
        ...response,
        user_image: `http://localhost:8000/api/users/${response?.user_id}/images`,
      });
      setLoading(false);
    }
  };

  

  const getUserInfo = async () => {
    let wishlistCount = 0;
    let orderCount = 0;
    let productCount = 0;
    const wishlistResponse = await UserService.getCurrentUserWishlist();
    if (wishlistResponse?.status != 400) {
      wishlistCount = wishlistResponse?.length;
      localStorage.setItem("wishlist", wishlistCount)
    }

    const orderResponse = await UserService.getCurrentUserOrders();
    if (orderResponse?.status != 400) {
      orderCount = orderResponse?.total_items;
      localStorage.setItem("order", orderCount)
    }

    const productResponse = await UserService.getCurrentUserProducts();
    if (productResponse?.status != 400) {
      productCount = productResponse?.total_items;
      localStorage.setItem("product", productCount)
    }

    setProductCount({
      ...productCount,
      wishlist: wishlistCount,
      myProduct: productCount,
      myOrder: orderCount,
    });
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="row my-3 justify-content-center w-100">
      <div className="col col-4 box-shadow px-5">

        <OauthSection text="Đăng nhập với: " />
       
        <Divider />

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3 input-group flex-nowrap">
            <span className="input-group-text">
              {" "}
              <FontAwesomeIcon icon="envelope" />
            </span>
            <input
              required
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="Nhập địa chỉ email"
              name="email"
              onInput={(e) => handleChange(e)}
              value={credentials.email}
            />
          </div>
          <div className="my-3 input-group flex-nowrap">
            <span className="input-group-text">
              <FontAwesomeIcon icon="lock" />
            </span>
            <input
              required
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="floatingPassword"
              placeholder="Nhập mật khẩu"
              name="password"
              onInput={handleChange}
              value={credentials.password}
            />
            <span
              className="input-group-text"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="form-check mb-0">
              <input
                className="form-check-input me-2"
                type="checkbox"
                defaultValue
                id="form2Example3"
              />
              <label className="form-check-label" htmlFor="form2Example3">
                Nhớ mật khẩu
              </label>
            </div>
            <a href="/find-account" className="text-body">
              Quên mật khẩu?
            </a>
          </div>

          <div className="my-4">
            
            {loading ? (
              <><Loading /></>
            ) : (
              <><button className="btn btn-dark text-white w-100 ">
              Đăng nhập
            </button></>
            )}
        {error && <div className="mt-4 alert alert-danger">{message}</div>}
            <p className="small fw-bold mt-2 pt-1 mb-0">
              Chưa có tài khoản?
              <a href="/register" className="link-danger">
                {" "}
                Đăng ký
              </a>
            </p>
          </div>
        </form>
      </div>
      <div className="col col-1"></div>
      <div className="col col-3 text-center">
        <h1>Hãy đăng nhập</h1>
        <p className="font-italic text-muted mb-0">
          Đăng nhập tài khoản của bạn tại đây
        </p>
        <img src="/assets/images/login.gif" className="img-fluid" alt="" />
      </div>
    </div>
  );
};

export default LoginForm;
