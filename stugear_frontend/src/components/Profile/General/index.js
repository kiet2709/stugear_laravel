import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import UserService from "../../../service/UserService";
import useAuth from "../../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-date-picker";
const General = () => {
  const [userInfo, setUserInfo] = useState({gender: 0});
  const { user, setUser } = useAuth();
  const [isUpdated, setUpdated] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const getCurrentUser = async (id) => {
    const response = await UserService.getCurrentUser();

    if (response == 500) {
      console.log("Something went wrong");
    } else {
      setUserInfo(response);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  console.log(userInfo)
  const handleFileChange = async (e) => {
    await UserService.uploadImage(user?.user_id, e.target.files[0]);
    setUser({
      ...user,
      user_image:
        `http://localhost:8000/api/users/${user?.user_id}/images/` +
        `?timestamp=${new Date().getTime()}`,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEdit(false);

    const response = await UserService.updateUserProfile(userInfo);
    if(response?.status != 400){
    setUpdated(true);
      
      toast.success("Thay đổi thông tin thành công!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }else{
      setUpdated(true);
   
    }
  
  };
  const handleEdit = (e) => {
    e.preventDefault();
    setEdit(true);
  };

  const handleDateChange = (date) => {
    setUserInfo({...userInfo, birthdate: new Date(date).toISOString().slice(0, 10)})
  }
  return (
    <div
      className="tab-pane fade active show"
      id="account-general"
      style={{ padding: "40px" }}
    >
      <div className="card-body row d-flex media align-items-center">
        <div className="col-2">
          <img src={user?.user_image} alt="" className="img-fluid" />
        </div>
        <div className="media-body col">
          <label className="btn btn-outline-primary">
            Thay đổi ảnh đại diện
            <input
              type="file"
              className="account-settings-file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
            />
          </label>
          <div className="text-light text-dark small mt-3">
            Cho phép JPG, hoặc PNG.
          </div>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={(e) => handleSubmit(e)}>
          <h4 className="font-weight-bold pl-4">Thông tin cá nhân</h4>
          <div className="row mt-3">
            <div className="col my-3 input-group flex-nowrap">
              <span className="input-group-text">
                {" "}
                <FontAwesomeIcon icon="user" />
              </span>
              <input
                required
                disabled
                type="text"
                className="form-control"
                placeholder="Tên đăng nhập"
                value={userInfo.name}
                onChange={(e) => handleChange(e)}
                name="name"
              />
            </div>
            <div className="col my-3 input-group flex-nowrap">
              <span className="input-group-text">
                {" "}
                <FontAwesomeIcon icon="envelope" />
              </span>

              <input
                required
                type="email"
                disabled
                className="form-control"
                placeholder="Email"
                value={userInfo.email}
                onChange={(e) => handleChange(e)}
                name="email"
              />
            </div>
          </div>

          <div className="row">
            <div className="col my-3 input-group flex-nowrap">
              <span className="input-group-text"> Tên</span>
              <input
                required
                type="text"
                className="form-control"
                placeholder="Tên"
                disabled={isEdit ? false : true}
                value={userInfo.first_name}
                onChange={(e) => handleChange(e)}
                name="first_name"
              />
            </div>
            <div className="col my-3 input-group flex-nowrap">
              <span className="input-group-text"> Họ</span>
              <input
                required
                type="text"
                className="form-control"
                placeholder="Họ"
                disabled={isEdit ? false : true}
                value={userInfo.last_name}
                onChange={(e) => handleChange(e)}
                name="last_name"
              />
            </div>
          </div>

          <div className="row">
            <div className="col my-3 input-group flex-nowrap">
              <span className="input-group-text">
                {" "}
                <FontAwesomeIcon icon="address-book" />
              </span>
              <input
                required
                type="text"
                className="form-control"
                placeholder="Địa chỉ"
                disabled={isEdit ? false : true}
                value={userInfo.full_address}
                onChange={(e) => handleChange(e)}
                name="full_address"
              />
            </div>
            <div className="col my-3 input-group flex-nowrap">
              <span className="input-group-text">
                {" "}
                <FontAwesomeIcon icon="phone" />
              </span>
              <input
                required
                type="text"
                className="form-control"
                disabled={isEdit ? false : true}
                placeholder="Số điện thoại"
                value={userInfo.phone_number}
                onChange={(e) => handleChange(e)}
                name="phone_number"
              />
            </div>
          </div>

          <div className="row">
            <div className="col   my-3 input-group ">
              <span className="input-group-text">
                {" "}
                <FontAwesomeIcon icon="globe" />
              </span>
              <input
                required
                type="text"
                className="form-control"
                disabled={isEdit ? false : true}
                placeholder="Mạng xã hội"
                value={userInfo.social_link}
                onChange={(e) => handleChange(e)}
                name="social_link"
              />
            </div>
            <div className="col  my-3 input-group flex-nowrap">
              <div className=" mt-2">
                <span>Giới tính: </span>
                <div className="form-check form-check-inline ms-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    disabled={isEdit ? false : true}
                    name="gender"
                    id="male-radio"
                    value={0}
                    checked={userInfo?.gender == 0}
                    onChange={(e) => handleChange(e)}
                  />
                  <label className="form-check-label" htmlFor="male-radio">
                   Nam
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    disabled={isEdit ? false : true}
                    name="gender"
                    id="female-radio"
                    value={1}
                    checked={userInfo?.gender == 1}
                    onChange={(e) => handleChange(e)}
                  />
                  <label className="form-check-label" htmlFor="female-radio">
                    Nữ
                  </label>
                </div>
              
              </div>
            </div>  
           
          </div>
          <div className="row">

          <div className="col  my-3 input-group flex-nowrap">
            <span className="me-3 mt-2">Ngày sinh: </span>
            <DatePicker
                format="dd-MM-y"
                required
                onChange={(date) => handleDateChange(date)}
                selected={userInfo.birthdate} 
                value={userInfo.birthdate}
                disabled={isEdit ? false : true}
                locale="vi-VN"
              />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-end">
            {isEdit === false ? (
              <>
                {" "}
                <button
                  className="btn"
                  style={{ backgroundColor: "#c60303" }}
                  onClick={(e) => handleEdit(e)}
                >
                  <FontAwesomeIcon icon="pencil" className="me-2" />
                  Chỉnh sửa
                </button>
              </>
            ) : (
              <>
                {" "}
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi
                </button>
              </>
            )}
            &nbsp;
          </div>
        </form>
      </div>
      {isUpdated ? (
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
    </div>
  );
};

export default General;
