import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OauthSection from "../OauthSection";
import Divider from "../../components/Divider";
import { useState } from "react";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/index";
import UserService from "../../service/UserService";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConFirmPassword, setShowConFirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConFirmPassword(!showConFirmPassword);
  };
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const [user, setUser] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCheckPassword = () => {
    return user.password === user.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    if (handleCheckPassword()) {
      setLoading(true);
      const response = await AuthService.register(user);
      setLoading(false);

      if (response.status === 400) {
        setError({
          field: Object.keys(response?.data?.error)[0],
          message: Object.values(response?.data?.error)[0],
        });
      } else if (response.status === 200) {
        const result = UserService.sendVerifyEmail(user.email);
        console.log(result);
        navigate(`/verify/${user.email}`);
      } else {
        console.log(response);
      }
    } else {
      setError({
        field: "confirmPassword",
        message: "Mật khẩu xác nhận không khớp",
      });
    }
  };

  return (
    <>
      <div className="row my-3 justify-content-center w-100">
        <div className="col col-4 text-center">
          <h1>Hãy tạo tài khoản {loading}</h1>
          <p className="font-italic text-muted mb-0">
            Nhập thông tin để tạo tài khoản của bạn
          </p>
          <img src="/assets/images/register.gif" alt="" className="img-fluid" />
        </div>
        <div className="col col-1"></div>
        <div className="col col-4 box-shadow px-5">
          {loading && <Loading />}

          <OauthSection text="Đăng ký với: " />
          <Divider />

          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
              <div className="col my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon="user" />
                </span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Tên đăng nhập"
                  name="name"
                  onChange={(e) => handleChange(e)}
                  value={user.name}
                />
              </div>
            </div>
            {error.field === "name" && (
              <div className="alert alert-danger">{error.message}</div>
            )}
            <div className="row">
              <div className="col my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon="user" />
                </span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Tên"
                  name="firstName"
                  onChange={(e) => handleChange(e)}
                  value={user.firstName}
                />
              </div>
              <div className="col my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon="user" />
                </span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Họ"
                  name="lastName"
                  onChange={(e) => handleChange(e)}
                  value={user.lastName}
                />
              </div>
            </div>
            {error.field === "firstName" && (
              <div className="alert alert-danger">{error.message}</div>
            )}
            {error.field === "lastName" && (
              <div className="alert alert-danger">{error.message}</div>
            )}
            <div className="row">
              <div className="col my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon="envelope" />
                </span>
                <input
                  required
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  value={user.email}
                />
              </div>
            </div>
            {error.field === "email" && (
              <div className="alert alert-danger">{error.message}</div>
            )}

            <div className="row">
              <div className="col my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon="lock" />
                </span>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Mật khẩu"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  value={user.password}
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                </span>
              </div>
              {error.field === "password" && (
                <div className="alert alert-danger">{error.message}</div>
              )}
            </div>
            <div className="row">
              {" "}
              <div className="col my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon="lock" />
                </span>
                <input
                  required
                  type={showConFirmPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  name="confirmPassword"
                  onChange={(e) => handleChange(e)}
                  value={user.confirmPassword}
                />
                <span
                  className="input-group-text"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <FontAwesomeIcon icon={showConFirmPassword ? "eye-slash" : "eye"} />
                </span>
              </div>
            </div>
            {error.field === "confirmPassword" && (
              <div className="alert alert-danger">{error.message}</div>
            )}

            <div className="my-4">
              <button className="btn btn-dark text-white w-100 ">
                Đăng ký
              </button>
              <p className="small fw-bold mt-2 pt-1 mb-0">
                Đã có tài khoản?
                <a href="/login" className="link-danger">
                  {" "}
                  Đăng nhập
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
